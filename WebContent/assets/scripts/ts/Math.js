//--------------------------------------------------------------------------
// Math
//--------------------------------------------------------------------------
InstallFunctions(Math,DONT_ENUM,[
	"randomInt",function randomInt(m,n){
		var l=arguments.length;
		if(l==0){
			n=0x80000000,m=0;
		}else if(l==1){
			n=m,m=0;
		}
		return Math.floor(Math.random()*(n-m))+m;
	},
	"sum",function sum(){
		var l=arguments.length,sum=0,i;
		for(i=0;i<l;i++){
			sum+=arguments[i];
		}
		return sum;
	}
]);