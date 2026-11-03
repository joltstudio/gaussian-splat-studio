import {open,stat} from 'node:fs/promises';import {createReadStream} from 'node:fs';import {createHash} from 'node:crypto';import {extname} from 'node:path';
export function inspectHeader(buffer,size,extension){
  const warnings=[];let format='unknown',vertices=null,compatible=false;
  if(extension==='.ply'){
    const raw=buffer.toString('latin1'),end=raw.indexOf('end_header');if(!raw.startsWith('ply\n')&&!raw.startsWith('ply\r\n'))throw new Error('PLY magic header missing');if(end<0)throw new Error('PLY header missing or exceeds 1 MiB');
    const header=raw.slice(0,end);const encoding=header.match(/^format (\S+) /m)?.[1];if(!['binary_little_endian','ascii'].includes(encoding))throw new Error('Unsupported PLY encoding');
    vertices=Number(header.match(/^element vertex (\d+)/m)?.[1]||0);if(vertices<1)throw new Error('No vertices');
    const props=header.split(/\r?\n/).filter(l=>l.startsWith('property ')).map(l=>l.split(' ').at(-1));
    const standard=['x','y','z','opacity','scale_0','scale_1','scale_2','rot_0','rot_1','rot_2','rot_3','f_dc_0','f_dc_1','f_dc_2'].every(n=>props.includes(n));
    const packed=['packed_position','packed_rotation','packed_scale','packed_color'].every(n=>props.includes(n));
    if(!standard&&!packed)throw new Error('This PLY is not a recognised Gaussian splat. Export Splat PLY, not a mesh or plain point cloud.');
    format=packed?'compressed-ply':'gaussian-ply';compatible=true;
    if(encoding==='binary_little_endian'&&standard){const block=header.match(/element vertex \d+\r?\n([\s\S]*?)(?=element |$)/)?.[1]||'';const widths={char:1,uchar:1,int8:1,uint8:1,short:2,ushort:2,int16:2,uint16:2,int:4,uint:4,float:4,int32:4,uint32:4,float32:4,double:8,float64:8};let stride=0;for(const l of block.split(/\r?\n/)){if(l.startsWith('property ')){const type=l.split(' ')[1];if(!widths[type])throw new Error('Unsupported vertex property');stride+=widths[type];}}const headerBytes=raw.indexOf('\n',end)+1;if(!headerBytes||size<headerBytes+vertices*stride)throw new Error('PLY payload appears truncated');}
  }else if(extension==='.sog'){
    if(buffer.readUInt32LE(0)!==0x04034b50)throw new Error('Bundled SOG must be a ZIP container');format='sog-container';compatible=true;warnings.push('Container signature only; decode with PlayCanvas or splat-transform to verify textures and metadata.');
  }else if(extension==='.spz'){
    if(buffer[0]!==0x1f||buffer[1]!==0x8b)throw new Error('SPZ gzip signature missing');format='spz-container';warnings.push('Convert SPZ to PLY for editing or SOG for this viewer. Payload not decoded.');
  }else throw new Error('Supported import extensions: .ply, .sog, .spz');
  if(size>50*1048576)warnings.push('Over 50 MiB: make a smaller mobile variant and test on a real phone.');
  return{format,vertices,sizeBytes:size,compatibleWithViewer:compatible,warnings};
}
export async function inspect(path){const s=await stat(path);if(!s.isFile()||s.size<4)throw new Error('Input is empty or not a file');const handle=await open(path,'r');const b=Buffer.alloc(Math.min(s.size,1048576));try{await handle.read(b,0,b.length,0);}finally{await handle.close();}const metadata=inspectHeader(b,s.size,extname(path).toLowerCase());const hash=createHash('sha256');for await(const chunk of createReadStream(path))hash.update(chunk);return{...metadata,sha256:hash.digest('hex')};}
