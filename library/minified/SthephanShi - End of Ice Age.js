t/=44100,b=(105*t/60)%256,C=262,D=294,EE=330,Gb=370,G=392,A=440,B=494,W=a=>a*1E-4*sin(44*t),R=(f,...a)=>f(...a,0)+.8*f(...a,.4)+.6*f(...a,.8)+.4*f(...a,1.2),P=(p,e)=>18*(.7*(p*(t+W(5))*[C,D,EE,D,C,D,B/2,C][((b-e)>>1)%8]%2)|0),T=(p,e)=>.3*(abs(((255*p*(t+W(4))*[D,Gb,G,B,EE,Gb,G,Gb,D,EE,G,A,EE,Gb,G,Gb][((b-e)>>1)%16])&255)-128)),N=(a,s,l,p)=>a[(s*b|0)%l]*(1E5*sin((t*p|0)**2)&255),k=b>32,l=b<128,m=b>160,n=b<192,((b>80&&l||m&&n)&&53*(b*(256>>32*b)%2|0))+((b>64&&l||b>144&&n)&&N('1000000010000000111111001000100010000000111111001000000011111000',16,64,3E4)/8)+((b>80&&l||m&&n)&&N('0010',2,4,35E2))/5+((!l&&!m)&&N('30020010010010003222111111111000',8,32,20E2)/8)+(k&&.6*P(1,0)+P(1.5,1)+.8*P(2,1))+(!k&&R((a,e)=>(w=b%8>6,(w?12:24)*(2*(t+(w&&W(4)))*a[int(2*(b-e))%32]%2|0)),[C,D,G,C,D,G,C,D,A,C,D,A,A,A,A,,D,G,B,D,G,B,D,G,A,C,G,A,A,A,A]))+((k&&b<65||!n&&b<225)&&R((a,s,e)=>(i=b-s-e,24*((i&16?4:2)*t*a[(2*i|0)%32]%2|0)),[,,G,,Gb,A,,Gb,B,,G,B,,,A,,,,C*2,,B,D*2,,B,EE*2,,B,EE*2,,,D*2],n?32:192))+(b>64&&b<193&&R((a,s,e)=>(i=b-s-e,24*((i&16?4:2)*(t+((i&32)&&W(5)))*a[3*((i>>1)%8)+int((i&64?22:2)*i)%3]%2|0)),[C,D,G,D,Gb,A,EE,G,B,D,Gb,A,C*2,D,G,D*2,Gb,B,EE*2,G,B,D*2,Gb,A],64))+(!n&&T(1,0)+.8*T(1,.4)+.6*T(2,1)+.4*T(1,1.2))