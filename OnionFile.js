
// some data for testing
var onionFile = {
		name:"pIB2-SEC13-mEGFP",
		features : [
			{start:1,end:211,strand:"+",color:"#8EC78D",text:"mEGFP",textColor:"black",type:"CDS"},
			{start:186,end:673,strand:"+",color:"#C5C4C1",text:"GAP promoter",textColor:"black",type:"promoter"}
			,{start:690,end:1632,strand:"+",color:"#D28482",text:"SEC13",textColor:"yellow",type:"CDS"}
			,{start:1652,end:2372,strand:"+",color:"#8EC78D",text:"mEGFP",textColor:"black",type:"CDS"}
			,{start:2758,end:3348,strand:"-",color:"#C5C4C1",text:"ori",textColor:"black",type:"rep_origin"}
			,{start:2481,end:2697,strand:".",color:"#EFAC7E",text:"AOX1 Terminator",textColor:"black",type:"terminator"}
			,{start:3517,end:4378,strand:"-",color:"#8EC78D",text:"AmpR",textColor:"black",type:"CDS"}
			,{start:4477,end:7012,strand:"+",color:"#EFAC7E",text:"PpHIS4",textColor:"black",type:"CDS"}
			//,{start:7013,end:112,strand:".",color:"#FF8800",text:"PpHIS4",textColor:"black",isORF:false,type:"CDS"}
			//,{start:4433,end:5299,strand:"+",color:"#000000",text:"Test05",textColor:"white",isORF:false}
			//,{start:5233,end:6649,strand:"-",color:"#FFaaaa",text:"Test06",textColor:"black",isORF:false}
			//,{start:3,end:48,strand:"-",color:"#FFaaaa",text:"Test06",textColor:"black",isORF:true}
			],
		enzymes : [
			{pos:[1000,1004],rsPos:[100,104],name:"BsmbI"},
			{pos:[1200,1204],rsPos:[100,104],name:"BsaI"}
		],
		primers : [
		],
		blocks:[{start:0,length:10,color:"#ABC7C7"}
	//		{start:1000,length:2000,color:"#C7CDCD"},
	//		{start:2000,length:5235,color:"#CDABCC"},
				],
	//seq:"ATGTTTTAA"
		seq : "TCGCGCGTTTCGGTGATGACGGTGAAAACCTCTGACACATGCAGCTCCCGGAGACGGTCACAGCTTGTCTGTAAGCGGATGCCGGGAGCAGACAAGCCCGTCAGGGCGCGTCAGCGGGTGTTGGCGGGTGTCGGGGCTGGCTTAACTATGCGGCATCAGAGCAGATTGTACTGAGAGTGCACCATAGATCCTTTTTTGTAGAAATGTCTTGGTGTCCTCGTCCAATCAGGTAGCCATCTCTGAAATATCTGGCTCCGTTGCAACTCCGAACGACCTGCTGGCAACGTAAAATTCTCCGGGGTAAAACTTAAATGTGGAGTAATGGAACCAGAAACGTCTCTTCCCTTCTCTCTCCTTCCACCGCCCGTTACCGTCCCTAGGAAATTTTACTCTGCTGGAGAGCTTCTTCTACGGCCCCCTTGCAGCAATGCTCTTCCCAGCATTACGTTGCGGGTAAAACGGAAGTCGTGTACCCGACCTAGCAGCCCAGGGATGGAAAAGTCCCGGCCGTCGCTGGCAATAATAGCGGGCGGACGCATGTCATGAGATTATTGGAAACCACCAGAATCGAATATAAAAGGCGAACACCTTTCCCAATTTTGGTTTCTCCTGACCCAAAGACTTTAAATTTAATTTATTTGTCCCTATTTCAATCAATTGAACAACTATCAAGAATTCGAGCTCGGTACCATGGCAAGTATAGTTTTCCGTACAAGTCCCTTGCTGGTCTGCTTCTCTATTCAATGTATTTGTACTAACCCTAGTAGGTTACAATTGGAAACGCACATGATGACCTAATCCATGACGCCGTTCTAGATTACTATGGACGTCGACTGGCCACCTGTTCATCGGACAAGACAATCAAGATTTTTGAGATCGATGGGGAGAACCAACGATTGGTGGAAACTTTAATCGGACACGAAGGACCTGTGTGGCAAGTTGCATGGGCCCATCCTAAATTTGGAGTCATTCTTGCCTCGTGTTCTTATGACGGTAAAGTTTTGATTTGGAAAGAAGACAACGGTGTATGGAACAAAGTGGCTGAACATTCCGTTCATCAGGCATCTGTTAATAGTGTTTCCTGGGCACCTCATGAATACGGTCCTGTTTTGCTCTGTGCTTCCAGTGATGGGAAGATATCCATTGTCGAATTCAAGGACGGAGGAGCCTTGGAACCTATTGTCATCCAAGGTCACGCTATAGGCGTGAATGCTGCCTCTTGGGCTCCAATTTCATTGCCCGATAATACGAGGCGGTTTGTTTCTGGTGGCTGTGACAATCTAGTCAAAATTTGGAGATACGATGACGCCGCAAAAACATTTATCGAAGAAGAAGCTTTTCAAGGACATTCCGACTGGGTCAGAGATGTGGCATGGTCTCCTTCTCGTTTATCAAAGTCATACATTGCCACTGCCTCACAAGATCGTACAGTATTGATTTGGACTAAAGATGGAAAATCTAACAAATGGGAAAAACAGCCTTTAACAAAGGAAAAATTCCCCGATGTTTGTTGGAGAGCCAGCTGGTCTCTTAGTGGAAATGTATTGGCCATTTCGGGTGGTGATAATAAGGTCACTTTGTGGAAGGAAAACATCCAGGGCAAATGGGAGTCCGCTGGCGAAGTCGATCAAAGGGATCCACCGGTCGCCACCATGGTGAGCAAGGGCGAGGAGCTGTTCACCGGGGTGGTGCCCATCCTGGTCGAGCTGGACGGCGACGTAAACGGCCACAAGTTCAGCGTGTCCGGCGAGGGCGAGGGCGATGCCACCTACGGCAAGCTGACCCTGAAGTTCATCTGCACCACCGGCAAGCTGCCCGTGCCCTGGCCCACCCTCGTGACCACCCTGACCTACGGCGTGCAGTGCTTCAGCCGCTACCCCGACCACATGAAGCAGCACGACTTCTTCAAGTCCGCCATGCCCGAAGGCTACGTCCAGGAGCGCACCATCTTCTTCAAGGACGACGGCAACTACAAGACCCGCGCCGAGGTGAAGTTCGAGGGCGACACCCTGGTGAACCGCATCGAGCTGAAGGGCATCGACTTCAAGGAGGACGGCAACATCCTGGGGCACAAGCTGGAGTACAACTACAACAGCCACAACGTCTATATCATGGCCGACAAGCAGAAGAACGGCATCAAGGTGAACTTCAAGATCCGCCACAACATCGAGGACGGCAGCGTGCAGCTCGCCGACCACTACCAGCAGAACACCCCCATCGGCGACGGCCCCGTGCTGCTGCCCGACAACCACTACCTGAGCACCCAGTCCAAGCTGAGCAAAGACCCCAACGAGAAGCGCGATCACATGGTCCTGCTGGAGTTCGTGACCGCCGCCGGGATCACTCTCGGCATGGACGAGCTGTACAAGTAAAGCGGCCGCGACTCTAGTCTCGAGCTGCAGGCATGCAAGCTTCTTAGACATGACTGTTCCTCAGTTCAAGTTGGGCACTTACGAGAAGACCGGTCTTGCTAGATTCTAATCAAGAGGATGTCAGAATGCCATTTGCCTGAGAGATGCAGGCTTCATTTTTGATACTTTTTTATTTGTAACCTATATAGTATAGGATTTTTTTTGTCATTTTGTTTCTTCTCGTACGAGCTTGCTCCTGATCAGCCTATCTCGCAGCTGATGAATATCTTGTGGTAGGGGTTTGGGAAAATCATTCGAGTTTGATGTTTTTCTTGGTATTTCCCACACATGTGAGCAAAAGGCCAGCAAAAGGCCAGGAACCGTAAAAAGGCCGCGTTGCTGGCGTTTTTCCATAGGCTCCGCCCCCCTGACGAGCATCACAAAAATCGACGCTCAAGTCAGAGGTGGCGAAACCCGACAGGACTATAAAGATACCAGGCGTTTCCCCCTGGAAGCTCCCTCGTGCGCTCTCCTGTTCCGACCCTGCCGCTTACCGGATACCTGTCCGCCTTTCTCCCTTCGGGAAGCGTGGCGCTTTCTCATAGCTCACGCTGTAGGTATCTCAGTTCGGTGTAGGTCGTTCGCTCCAAGCTGGGCTGTGTGCACGAACCCCCCGTTCAGCCCGACCGCTGCGCCTTATCCGGTAACTATCGTCTTGAGTCCAACCCGGTAAGACACGACTTATCGCCACTGGCAGCAGCCACTGGTAACAGGATTAGCAGAGCGAGGTATGTAGGCGGTGCTACAGAGTTCTTGAAGTGGTGGCCTAACTACGGCTACACTAGAAGAACAGTATTTGGTATCTGCGCTCTGCTGAAGCCAGTTACCTTCGGAAAAAGAGTTGGTAGCTCTTGATCCGGCAAACAAACCACCGCTGGTAGCGGTGGTTTTTTTGTTTGCAAGCAGCAGATTACGCGCAGAAAAAAAGGATCTCAAGAAGATCCTTTGATCTTTTCTACGGGGTCTGACGCTCAGTGGAACGAAAACTCACGTTAAGGGATTTTGGTCATGAGATTATCAAAAAGGATCTTCACCTAGATCCTTTTAAATTAAAAATGAAGTTTTAAATCAATCTAAAGTATATATGAGTAAACTTGGTCTGACAGTTACCAATGCTTAATCAGTGAGGCACCTATCTCAGCGATCTGTCTATTTCGTTCATCCATAGTTGCCTGACTCCCCGTCGTGTAGATAACTACGATACGGGAGGGCTTACCATCTGGCCCCAGTGCTGCAATGATACCGCGAGACCCACGCTCACCGGCTCCAGATTTATCAGCAATAAACCAGCCAGCCGGAAGGGCCGAGCGCAGAAGTGGTCCTGCAACTTTATCCGCCTCCATCCAGTCTATTAATTGTTGCCGGGAAGCTAGAGTAAGTAGTTCGCCAGTTAATAGTTTGCGCAACGTTGTTGCCATTGCTACAGGCATCGTGGTGTCACGCTCGTCGTTTGGTATGGCTTCATTCAGCTCCGGTTCCCAACGATCAAGGCGAGTTACATGATCCCCCATGTTGTGCAAAAAAGCGGTTAGCTCCTTCGGTCCTCCGATCGTTGTCAGAAGTAAGTTGGCCGCAGTGTTATCACTCATGGTTATGGCAGCACTGCATAATTCTCTTACTGTCATGCCATCCGTAAGATGCTTTTCTGTGACTGGTGAGTACTCAACCAAGTCATTCTGAGAATAGTGTATGCGGCGACCGAGTTGCTCTTGCCCGGCGTCAATACGGGATAATACCGCGCCACATAGCAGAACTTTAAAAGTGCTCATCATTGGAAAACGTTCTTCGGGGCGAAAACTCTCAAGGATCTTACCGCTGTTGAGATCCAGTTCGATGTAACCCACTCGTGCACCCAACTGATCTTCAGCATCTTTTACTTTCACCAGCGTTTCTGGGTGAGCAAAAACAGGAAGGCAAAATGCCGCAAAAAAGGGAATAAGGGCGACACGGAAATGTTGAATACTCATACTCTTCCTTTTTCAATGATCTCCTGATGACTGACTCACTGATAATAAAAATACGGCTTCAGAATTTCTCAAGACTACACTCACTGTCCGACTTCAAGTATGACATTTCCCTTGCTACCTGCATACGCAAGTGTTGCAGAGTTTGATAATTCCTTGAGTTTGGTAGGAAAAGCCGTGTTTCCCTATGCTGCTGACCAGCTGCACAACCTGATCAAGTTCACTCAATCGACTGAGCTTCAAGTTAATGTGCAAGTTGAGTCATCCGTTACAGAGGACCAATTTGAGGAGCTGATCGACAACTTGCTCAAGTTGTACAATAATGGTATCAATGAAGTGATTTTGGACCTAGATTTGGCAGAAAGAGTTGTCCAAAGGATGATCCCAGGCGCTAGGGTTATCTATAGGACCCTGGTTGATAAAGTTGCATCCTTGCCCGCTAATGCTAGTATCGCTGTGCCTTTTTCTTCTCCACTGGGCGATTTGAAAAGTTTCACTAATGGCGGTAGTAGAACTGTTTATGCTTTTTCTGAGACCGCAAAGTTGGTAGATGTGACTTCCACTGTTGCTTCTGGTATAATCCCCATTATTGATGCTCGGCAATTGACTACTGAATACGAACTTTCTGAAGATGTCAAAAAGTTCCCTGTCAGTGAAATTTTGTTGGCGTCTTTGACTACTGACCGCCCCGATGGTCTATTCACTACTTTGGTGGCTGACTCTTCTAATTACTCGTTGGGCCTGGTGTACTCGTCCAAAAAGTCTATTCCGGAGGCTATAAGGACACAAACTGGAGTCTACCAATCTCGTCGTCACGGTTTGTGGTATAAAGGTGCTACATCTGGAGCAACTCAAAAGTTGCTGGGTATCGAATTGGATTGTGATGGAGACTGCTTGAAATTTGTGGTTGAACAAACAGGTGTTGGTTTCTGTCACTTGGAACGCACTTCCTGTTTTGGCCAATCAAAGGGTCTTAGAGCCATGGAAGCCACCTTGTGGGATCGTAAGAGCAATGCTCCAGAAGGTTCTTATACCAAACGGTTATTTGACGACGAAGTTTTGTTGAACGCTAAAATTAGGGAGGAAGCTGATGAACTTGCAGAAGCTAAATCCAAGGAAGATATAGCCTGGGAATGTGCTGACTTATTTTATTTTGCATTAGTTAGATGTGCCAAGTACGGTGTGACGTTGGACGAGGTGGAGAGAAACCTGGATATGAAGTCCCTAAAGGTCACTAGAAGGAAAGGAGATGCCAAGCCAGGATACACCAAGGAACAACCTAAAGAAGAATCCAAACCTAAAGAAGTCCCTTCTGAAGGTCGTATTGAATTGTGCAAAATTGACGTTTCTAAGGCCTCCTCACAAGAAATTGAAGATGCCCTTCGTCGTCCTATCCAGAAAACGGAACAGATTATGGAATTAGTCAAACCAATTGTCGACAATGTTCGTCAAAATGGTGACAAAGCCCTTTTAGAACTAACTGCCAAGTTTGATGGAGTCGCTTTGAAGACACCTGTGTTAGAAGCTCCTTTCCCAGAGGAACTTATGCAATTGCCAGATAACGTTAAGAGAGCCATTGATCTCTCTATAGATAACGTCAGGAAATTCCATGAAGCTCAACTAACGGAGACGTTGCAAGTTGAGACTTGCCCTGGTGTAGTCTGCTCTCGTTTTGCAAGACCTATTGAGAAAGTTGGCCTCTATATTCCTGGTGGAACCGCAATTCTGCCTTCCACTTCCCTGATGCTGGGTGTTCCTGCCAAAGTTGCTGGTCGCAAAGAAATTGTTTTTGCATCTCCACCTAAGAAGGATGGCACCCTTACCCCAGAAGTCATCTACGTTGCCCACAAGGTTGGTGCTAAGTGTATCGTGCTAGCAGGAGGCGCCCAGGCAGTAGCTGCTATGGCTTACGGAACAGAAACTGTTCCTAAGTGTGACAAAATATTTGGTCCAGGAAACCAGTTCGTTACTGCTGCCAAGATGATGGTTCAAAATGACACATCAGCCCTGTGTAGTATTGACATGCCTGCTGGGCCTTCTGAAGTTCTAGTTATTGCTGATAAATACGCTGATCCAGATTTCGTTGCCTCAGACCTTCTGTCTCAAGCTGAACATGGTATTGATTCCCAGGTGATTCTGTTGGCTGTCGATATGACAGACAAGGAGCTTGCCAGAATTGAAGATGCTGTTCACAACCAAGCTGTGCAGTTGCCAAGGGTTGAAATTGTACGCAAGTGTATTGCACACTCTACAACCCTATCGGTTGCAACCTACGAGCAGGCTTTGGAAATGTCCAATCAGTACGCTCCTGAACACTTGATCCTGCAAATCGAGAATGCTTCTTCTTATGTTGATCAAGTACAACACGCTGGATCTGTGTTTGTTGGTGCCTACTCTCCAGAGAGTTGTGGAGATTACTCCTCCGGCACCAACCACACTTTGCCAACGTACGGATATGCCCGTCAATACAGCGGAGTTAACACTGCAACCTTCCAGAAGTTCATCACTTCACAAGACGTAACTCCTGAGGGACTGAAACATATTGGCCAAGCAGTGATGGATCTGGCTGCTGTTGAAGGTCTAGATGCTCACCGCAATGCTGTTAAGGTTCGTATGGAGAAACTGGGACTTATTTAATTATTTAGAGATTTTAACTTACATTTAGATTCGATAGATCATTATTGAAGCATTTATCAGGGTTATTGTCTCATGAGCGGATACATATTTGAATGTATTTAGAAAAATAAACAAATAGGGGTTCCGCGCACATTTCCCCGAAAAGTGCCACCTGACGTCTAAGAAACCATTATTATCATGACATTAACCTATAAAAATAGGCGTATCACGAGGCCCTTTCGTC",
	};


//// some data for testing
//var onionFile = {
//	name:"pIB2-SEC13-mEGFP",
//	features : [
//		{start:1,end:991,strand:"+",color:"#8EC78D",text:"mEGFP",textColor:"black",type:"CDS"},
//	],
//	enzymes : [
//		{pos:[1000,1004],rsPos:[100,104],name:"BsmbI"},
//		{pos:[1200,1204],rsPos:[100,104],name:"BsaI"}
//	],
//	primers : [
//	],
//	blocks:[{start:0,length:10,color:"#ABC7C7"}
//		//		{start:1000,length:2000,color:"#C7CDCD"},
//		//		{start:2000,length:5235,color:"#CDABCC"},
//	],
//	//seq:"ATGTTTTAA"
//	seq : "TCGCGCGTTTCGGTGATGACGGTGAAAACCTCTGACACATGCAGCTCCCGGAGACGGTCACAGCTTGTCTGTAAGCGGATGCCGGGAGCAGACAAGCCCGTCAGGGCGCGTCAGCGGGTGTTGGCGGGTGTCGGGGCTGGCTTAACTATGCGGCATCAGAGCAGATTGTACTGAGAGTGCACCATAGATCCTTTTTTGTAGAAATGTCTTGGTGTCCTCGTCCAATCAGGTAGCCATCTCTGAAATATCTGGCTCCGTTGCAACTCCGAACGACCTGCTGGCAACGTAAAATTCTCCGGGGTAAAACTTAAATGTGGAGTAATGGAACCAGAAACGTCTCTTCCCTTCTCTCTCCTTCCACCGCCCGTTACCGTCCCTAGGAAATTTTACTCTGCTGGAGAGCTTCTTCTACGGCCCCCTTGCAGCAATGCTCTTCCCAGCATTACGTTGCGGGTAAAACGGAAGTCGTGTACCCGACCTAGCAGCCCAGGGATGGAAAAGTCCCGGCCGTCGCTGGCAATAATAGCGGGCGGACGCATGTCATGAGATTATTGGAAACCACCAGAATCGAATATAAAAGGCGAACACCTTTCCCAATTTTGGTTTCTCCTGACCCAAAGACTTTAAATTTAATTTATTTGTCCCTATTTCAATCAATTGAACAACTATCAAGAATTCGAGCTCGGTACCATGGCAAGTATAGTTTTCCGTACAAGTCCCTTGCTGGTCTGCTTCTCTATTCAATGTATTTGTACTAACCCTAGTAGGTTACAATTGGAAACGCACATGATGACCTAATCCATGACGCCGTTCTAGATTACTATGGACGTCGACTGGCCACCTGTTCATCGGACAAGACAATCAAGATTTTTGAGATCGATGGGGAGAACCAACGATTGGTGGAAACTTTAATCGGACACGAAGGACCTGTGTGGCAAGTTGCATGGGCCCATCCTAAATTTGGAGTCATTCTTGCCTCGTGTTCTTATGACGGTAAAGTTTTGATTTGGAAAGAAGACAACGGTGTATGGAACAAAGTGGCTGAACATTCCGTTCATCAGGCATCTGTTAATAGTGTTTCCTGGGCACCTCATGAATACGGTCCTGTTTTGCTCTGTGCTTCCAGTGATGGGAAGATATCCATTGTCGAATTCAAGGACGGAGGAGCCTTGGAACCTATTGTCATCCAAGGTCACGCTATAGGCGTGAATGCTGCCTCTTGGGCTCCAATTTCATTGCCCGATAATACGAGGCGGTTTGTTTCTGGTGGCTGTGACAATCTAGTCAAAATTTGGAGATACGATGACGCCGCAAAAACATTTATCGAAGAAGAAGCTTTTCAAGGACATTCCGACTGGGTCAGAGATGTGGCATGGTCTCCTTCTCGTTTATCAAAGTCATACATTGCCACTGCCTCACAAGATCGTACAGTATTGATTTGGACTAAAGATGGAAAATCTAACAAATGGGAAAAACAGCCTTTAACAAAGGAAAAATTCCCCGATGTTTGTTGGAGAGCCAGCTGGTCTCTTAGTGGAAATGTATTGGCCATTTCGGGTGGTGATAATAAGGTCACTTTGTGGAAGGAAAACATCCAGGGCAAATGGGAGTCCGCTGGCGAAGTCGATCAAAGGGATCCACCGGTCGCCACCATGGTGAGCAAGGGCGAGGAGCTGTTCACCGGGGTGGTGCCCATCCTGGTCGAGCTGGACGGCGACGTAAACGGCCACAAGTTCAGCGTGTCCGGCGAGGGCGAGGGCGATGCCACCTACGGCAAGCTGACCCTGAAGTTCATCTGCACCACCGGCAAGCTGCCCGTGCCCTGGCCCACCCTCGTGACCACCCTGACCTACGGCGTGCAGTGCTTCAGCCGCTACCCCGACCACATGAAGCAGCACGACTTCTTCAAGTCCGCCATGCCCGAAGGCTACGTCCAGGAGCGCACCATCTTCTTCAAGGACGACGGCAACTACAAGACCCGCGCCGAGGTGAAGTTCGAGGGCGACACCCTGGTGAACCGCATCGAGCTGAAGGGCATCGACTTCAAGGAGGACGGCAACATCCTGGGGCACAAGCTGGAGTACAACTACAACAGCCACAACGTCTATATCATGGCCGACAAGCAGAAGAACGGCATCAAGGTGAACTTCAAGATCCGCCACAACATCGAGGACGGCAGCGTGCAGCTCGCCGACCACTACCAGCAGAACACCCCCATCGGCGACGGCCCCGTGCTGCTGCCCGACAACCACTACCTGAGCACCCAGTCCAAGCTGAGCAAAGACCCCAACGAGAAGCGCGATCACATGGTCCTGCTGGAGTTCGTGACCGCCGCCGGGATCACTCTCGGCATGGACGAGCTGTACAAGTAAAGCGGCCGCGACTCTAGTCTCGAGCTGCAGGCATGCAAGCTTCTTAGACATGACTGTTCCTCAGTTCAAGTTGGGCACTTACGAGAAGACCGGTCTTGCTAGATTCTAATCAAGAGGATGTCAGAATGCCATTTGCCTGAGAGATGCAGGCTTCATTTTTGATACTTTTTTATTTGTAACCTATATAGTATAGGATTTTTTTTGTCATTTTGTTTCTTCTCGTACGAGCTTGCTCCTGATCAGCCTATCTCGCAGCTGATGAATATCTTGTGGTAGGGGTTTGGGAAAATCATTCGAGTTTGATGTTTTTCTTGGTATTTCCCACACATGTGAGCAAAAGGCCAGCAAAAGGCCAGGAACCGTAAAAAGGCCGCGTTGCTGGCGTTTTTCCATAGGCTCCGCCCCCCTGACGAGCATCACAAAAATCGACGCTCAAGTCAGAGGTGGCGAAACCCGACAGGACTATAAAGATACCAGGCGTTTCCCCCTGGAAGCTCCCTCGTGCGCTCTCCTGTTCCGACCCTGCCGCTTACCGGATACCTGTCCGCCTTTCTCCCTTCGGGAAGCGTGGCGCTTTCTCATAGCTCACGCTGTAGGTATCTCAGTTCGGTGTAGGTCGTTCGCTCCAAGCTGGGCTGTGTGCACGAACCCCCCGTTCAGCCCGACCGCTGCGCCTTATCCGGTAACTATCGTCTTGAGTCCAACCCGGTAAGACACGACTTATCGCCACTGGCAGCAGCCACTGGTAACAGGATTAGCAGAGCGAGGTATGTAGGCGGTGCTACAGAGTTCTTGAAGTGGTGGCCTAACTACGGCTACACTAGAAGAACAGTATTTGGTATCTGCGCTCTGCTGAAGCCAGTTACCTTCGGAAAAAGAGTTGGTAGCTCTTGATCCGGCAAACAAACCACCGCTGGTAGCGGTGGTTTTTTTGTTTGCAAGCAGCAGATTACGCGCAGAAAAAAAGGATCTCAAGAAGATCCTTTGATCTTTTCTACGGGGTCTGACGCTCAGTGGAACGAAAACTCACGTTAAGGGATTTTGGTCATGAGATTATCAAAAAGGATCTTCACCTAGATCCTTTTAAATTAAAAATGAAGTTTTAAATCAATCTAAAGTATATATGAGTAAACTTGGTCTGACAGTTACCAATGCTTAATCAGTGAGGCACCTATCTCAGCGATCTGTCTATTTCGTTCATCCATAGTTGCCTGACTCCCCGTCGTGTAGATAACTACGATACGGGAGGGCTTACCATCTGGCCCCAGTGCTGCAATGATACCGCGAGACCCACGCTCACCGGCTCCAGATTTATCAGCAATAAACCAGCCAGCCGGAAGGGCCGAGCGCAGAAGTGGTCCTGCAACTTTATCCGCCTCCATCCAGTCTATTAATTGTTGCCGGGAAGCTAGAGTAAGTAGTTCGCCAGTTAATAGTTTGCGCAACGTTGTTGCCATTGCTACAGGCATCGTGGTGTCACGCTCGTCGTTTGGTATGGCTTCATTCAGCTCCGGTTCCCAACGATCAAGGCGAGTTACATGATCCCCCATGTTGTGCAAAAAAGCGGTTAGCTCCTTCGGTCCTCCGATCGTTGTCAGAAGTAAGTTGGCCGCAGTGTTATCACTCATGGTTATGGCAGCACTGCATAATTCTCTTACTGTCATGCCATCCGTAAGATGCTTTTCTGTGACTGGTGAGTACTCAACCAAGTCATTCTGAGAATAGTGTATGCGGCGACCGAGTTGCTCTTGCCCGGCGTCAATACGGGATAATACCGCGCCACATAGCAGAACTTTAAAAGTGCTCATCATTGGAAAACGTTCTTCGGGGCGAAAACTCTCAAGGATCTTACCGCTGTTGAGATCCAGTTCGATGTAACCCACTCGTGCACCCAACTGATCTTCAGCATCTTTTACTTTCACCAGCGTTTCTGGGTGAGCAAAAACAGGAAGGCAAAATGCCGCAAAAAAGGGAATAAGGGCGACACGGAAATGTTGAATACTCATACTCTTCCTTTTTCAATGATCTCCTGATGACTGACTCACTGATAATAAAAATACGGCTTCAGAATTTCTCAAGACTACACTCACTGTCCGACTTCAAGTATGACATTTCCCTTGCTACCTGCATACGCAAGTGTTGCAGAGTTTGATAATTCCTTGAGTTTGGTAGGAAAAGCCGTGTTTCCCTATGCTGCTGACCAGCTGCACAACCTGATCAAGTTCACTCAATCGACTGAGCTTCAAGTTAATGTGCAAGTTGAGTCATCCGTTACAGAGGACCAATTTGAGGAGCTGATCGACAACTTGCTCAAGTTGTACAATAATGGTATCAATGAAGTGATTTTGGACCTAGATTTGGCAGAAAGAGTTGTCCAAAGGATGATCCCAGGCGCTAGGGTTATCTATAGGACCCTGGTTGATAAAGTTGCATCCTTGCCCGCTAATGCTAGTATCGCTGTGCCTTTTTCTTCTCCACTGGGCGATTTGAAAAGTTTCACTAATGGCGGTAGTAGAACTGTTTATGCTTTTTCTGAGACCGCAAAGTTGGTAGATGTGACTTCCACTGTTGCTTCTGGTATAATCCCCATTATTGATGCTCGGCAATTGACTACTGAATACGAACTTTCTGAAGATGTCAAAAAGTTCCCTGTCAGTGAAATTTTGTTGGCGTCTTTGACTACTGACCGCCCCGATGGTCTATTCACTACTTTGGTGGCTGACTCTTCTAATTACTCGTTGGGCCTGGTGTACTCGTCCAAAAAGTCTATTCCGGAGGCTATAAGGACACAAACTGGAGTCTACCAATCTCGTCGTCACGGTTTGTGGTATAAAGGTGCTACATCTGGAGCAACTCAAAAGTTGCTGGGTATCGAATTGGATTGTGATGGAGACTGCTTGAAATTTGTGGTTGAACAAACAGGTGTTGGTTTCTGTCACTTGGAACGCACTTCCTGTTTTGGCCAATCAAAGGGTCTTAGAGCCATGGAAGCCACCTTGTGGGATCGTAAGAGCAATGCTCCAGAAGGTTCTTATACCAAACGGTTATTTGACGACGAAGTTTTGTTGAACGCTAAAATTAGGGAGGAAGCTGATGAACTTGCAGAAGCTAAATCCAAGGAAGATATAGCCTGGGAATGTGCTGACTTATTTTATTTTGCATTAGTTAGATGTGCCAAGTACGGTGTGACGTTGGACGAGGTGGAGAGAAACCTGGATATGAAGTCCCTAAAGGTCACTAGAAGGAAAGGAGATGCCAAGCCAGGATACACCAAGGAACAACCTAAAGAAGAATCCAAACCTAAAGAAGTCCCTTCTGAAGGTCGTATTGAATTGTGCAAAATTGACGTTTCTAAGGCCTCCTCACAAGAAATTGAAGATGCCCTTCGTCGTCCTATCCAGAAAACGGAACAGATTATGGAATTAGTCAAACCAATTGTCGACAATGTTCGTCAAAATGGTGACAAAGCCCTTTTAGAACTAACTGCCAAGTTTGATGGAGTCGCTTTGAAGACACCTGTGTTAGAAGCTCCTTTCCCAGAGGAACTTATGCAATTGCCAGATAACGTTAAGAGAGCCATTGATCTCTCTATAGATAACGTCAGGAAATTCCATGAAGCTCAACTAACGGAGACGTTGCAAGTTGAGACTTGCCCTGGTGTAGTCTGCTCTCGTTTTGCAAGACCTATTGAGAAAGTTGGCCTCTATATTCCTGGTGGAACCGCAATTCTGCCTTCCACTTCCCTGATGCTGGGTGTTCCTGCCAAAGTTGCTGGTCGCAAAGAAATTGTTTTTGCATCTCCACCTAAGAAGGATGGCACCCTTACCCCAGAAGTCATCTACGTTGCCCACAAGGTTGGTGCTAAGTGTATCGTGCTAGCAGGAGGCGCCCAGGCAGTAGCTGCTATGGCTTACGGAACAGAAACTGTTCCTAAGTGTGACAAAATATTTGGTCCAGGAAACCAGTTCGTTACTGCTGCCAAGATGATGGTTCAAAATGACACATCAGCCCTGTGTAGTATTGACATGCCTGCTGGGCCTTCTGAAGTTCTAGTTATTGCTGATAAATACGCTGATCCAGATTTCGTTGCCTCAGACCTTCTGTCTCAAGCTGAACATGGTATTGATTCCCAGGTGATTCTGTTGGCTGTCGATATGACAGACAAGGAGCTTGCCAGAATTGAAGATGCTGTTCACAACCAAGCTGTGCAGTTGCCAAGGGTTGAAATTGTACGCAAGTGTATTGCACACTCTACAACCCTATCGGTTGCAACCTACGAGCAGGCTTTGGAAATGTCCAATCAGTACGCTCCTGAACACTTGATCCTGCAAATCGAGAATGCTTCTTCTTATGTTGATCAAGTACAACACGCTGGATCTGTGTTTGTTGGTGCCTACTCTCCAGAGAGTTGTGGAGATTACTCCTCCGGCACCAACCACACTTTGCCAACGTACGGATATGCCCGTCAATACAGCGGAGTTAACACTGCAACCTTCCAGAAGTTCATCACTTCACAAGACGTAACTCCTGAGGGACTGAAACATATTGGCCAAGCAGTGATGGATCTGGCTGCTGTTGAAGGTCTAGATGCTCACCGCAATGCTGTTAAGGTTCGTATGGAGAAACTGGGACTTATTTAATTATTTAGAGATTTTAACTTACATTTAGATTCGATAGATCATTATTGAAGCATTTATCAGGGTTATTGTCTCATGAGCGGATACATATTTGAATGTATTTAGAAAAATAAACAAATAGGGGTTCCGCGCACATTTCCCCGAAAAGTGCCACCTGACGTCTAAGAAACCATTATTATCATGACATTAACCTATAAAAATAGGCGTATCACGAGGCCCTTTCGTC",
//};

export {onionFile};