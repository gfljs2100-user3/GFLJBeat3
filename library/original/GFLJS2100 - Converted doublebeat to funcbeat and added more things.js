return time=>{

const t = time * 31000;

const lead = "y";

return [(songs=[(songs=[(max(min(((((((((-t/512*(t&t>>14))&255)/128-1)+(((max(min(t/512*(t&t>>12)&255,255),-255)*127+127)&255)/128-1))+(((max(min(t/1024*(t&t>>13)&255,255),-255)*127+127)&255)/128-1)/1)+sin((1280000/(t&16383))*PI/128-1)/2))/1.4-0.1+((((t&16384?random()*255|t>>6:255)&255)/128-1)/(((t&16384?random()*255|t>>5:255)&255)/128-1)/2)-0.5)/2,255),-255)),(sin((t/1024*(t&(t^t>>4)>>12))*PI/128)/2+sin((t/2048*(t&(t^t>>4)>>13))*PI/128)/2)], songs.reduce((a,v)=>a+v%256,0)/songs.length)*2,(sin(t/8192*(t&t>>14))/2)/1], songs.reduce((a,v)=>a+v%256,0)/songs.length)+sin(time*8)/2,0.02*(random()*(lead.charCodeAt((time*30.2734375)%4)-32)|0)/2-0.2+sin(time*4)/4+sin(((time*30.2734375)%2)**-2/128)*2+(sin((t/1024*(t&(t^t>>4)>>12))*PI/128)/2+sin((t/2048*(t&(t^t>>4)>>13))*PI/128)/2)/2+((((min(max(t/512*(t&t>>12)&255,-255),255)*127+127)%256/2)&255)/128/8)+((((min(max(t/1024*(t&t>>13)&255,-255),255)*127+127)%256/2)&255)/128/8)+((((min(max(t/4096*(t&t>>14)&255,-255),255)*127+127)%256/2)&255)/128/8)]};