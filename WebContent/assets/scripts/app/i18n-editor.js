//---------------------------------------------------------
// main
//---------------------------------------------------------
var i18n={locales:[]};
function init($){
	var document=window.document,console=window.console;
	
	var table=$("#i18n_table")[0],
		jsonService=table.dataset.service,
		jsonSource=table.dataset.source,
		Keys={
			BACKSPACE:8,TAB:9,ENTER:13,ESCAPE:27,
			LEFT:37,UP:38,RIGHT:39,DOWN:40,
			S:83,N:78
		};
	function addRow(){
		var tbody=table.tBodies[0],
			dataKey=Math.uuid(),
			new_tr=createElement("tr",{"data-key":"","class":"moved"},tbody),
			keyCells=[],dataCells=[];
		$("th",table.tHead).each(function(index,th){
			var cell;
			if(index==0){                //index
				cell=createElement("td",{
					axis:"index"
				},new_tr);
				createElement("input",{
					type:"button",
					value:"Remove",
					"class":"i18n-button button-remove"
				},cell);
			}else if(index==1){           //key
				cell=createElement("td",{
					axis:"key",
					contentEditable:"true",
					innerText:"",
					"data-text":dataKey,
					"class":"modified"
				},new_tr);
				keyCells.push(cell);
			}else{                        //data
				cell=createElement("td",{
					lang:th.dataset.locale.replace("_","-"),
					contentEditable:"true",
					"data-text":dataKey,
					"class":"modified"
				},new_tr);
				dataCells.push(cell);
			}
		});
		$(keyCells)._on("keydown",cell_keyDown)._on("input",key_change);
		$(dataCells)._on("keydown",cell_keyDown)._on("input",cell_textChange)
		$(".button-remove",tbody)._on("click",function removeRow_click(event){
			$(this).closest("tr").remove();
		});
	}
	function addLocale(){
		var locale;
		do{
			locale=prompt("Please input locale code (e.g. fr_CA):").trim();
			if(/[a-z]{2}_[a-z]{2}/i.test(locale)){
				locale=locale.replace(/^([a-z]+)_([a-z]+)/i,function(s,l,c){
					return l.toLowerCase()+"_"+c.toUpperCase();
				});
				break;
			}else if(!locale){
				return;
			}else if(confirm("Format unsupported. try again?")){
				continue;
			}else{
				return;
			}
		}while(true);
		var lang=locale.replace("_","-"),uuid=Math.uuid(),cells=[];
		createElement("th",{
			innerText:locale,
			"data-locale":locale,
			"data-todo":"add"
		},table.tHead.rows[0]);
		$("tr",table.tBodies[0]).each(function(index,tr){
			var td=createElement("td",{
				innerText:"",
				lang:lang,
				"class":"modified",
				"data-text":uuid,
				contentEditable:"true"
			},tr);
			if(tr.dataset.key=="_locale"){
				td.dataset.text=td.innerText=locale;
			}
			cells.push(td);
		});
		$(cells)._on("keydown",cell_keyDown)._on("input",cell_textChange);
	}
	//listeners
	function key_change(event){
		var td=this,tr=td.parentNode;
		if(tr.dataset.key!=td.innerText){
			tr.dataset.key=td.innerText;
			tr.classList.add("moved");
		}
	}
	function cell_keyDown(event){
		var key=event.keyCode,cell=this;
		if(key===Keys.BACKSPACE){
			event.stopPropagation();
		}else if(key===Keys.ENTER){
			event.preventDefault();
		}else if(key===Keys.ESCAPE){
			cell.blur();
		}else if(key===Keys.UP||key===Keys.DOWN){
			var tr=cell.parentNode,prevTR,nextTR;
			if(key===Keys.UP){
				prevTR=tr.previousElementSibling;
				if(prevTR){
					prevTR.cells[cell.cellIndex].focus();
				}
			}else{
				nextTR=tr.nextElementSibling;
				if(nextTR){
					nextTR.cells[cell.cellIndex].focus();
				}
			}
		}
	}
	function cell_textChange(event){
		var td=this,tr=this.parentNode;
		if(td.innerText==td.dataset.text){
			$(td).removeClass("modified");
			if(!$("td.modified",tr).length){
				$(tr).removeClass("modified");
			}
		}else{;
			$(td).addClass("modified");
			$(tr).addClass("modified");
		}
	}
	function createElement(tag,attr,parent,position){
		var elem=document.createElement(tag),key=0;
		if(attr){
			for(key in attr){
				if(!attr.hasOwnProperty(key)){continue;}
				if(key in elem){
					elem[key]=attr[key];
				}else{
					elem.setAttribute(key,attr[key]);
				}
			}
		}
		if(parent){
			parent.appendChild(elem);
		}
		return elem;
	}
	function renderKeys(thead,tbody,props){
		var keys=Object.keys(props),l=keys.length,i,key,tr,td,cells=[];
		thead.innerHTML="";
		tbody.innerHTML="";
		tr=createElement("tr",null,thead);
		createElement("th",{abbr:"index",innerText:""},tr);
		createElement("th",{abbr:"key",innerText:"Keys"},tr);
		for(i=0;i<l;i++){
			key=keys[i];
			tr=createElement("tr",{"data-key":key},tbody);
			createElement("td",{axis:"index",innerText:"",draggable:"true"},tr);
			td=createElement("td",{axis:"key","data-text":key,innerText:key},tr);
			cells.push(td);
		}
		$("tr td[axis=index]",tbody)._on("dragstart",function tr_dragStart(event){
			var tr=this.parentNode,
				data=event.dataTransfer;
			data.effectAllowed="move";
			data.setData("Text",tr.dataset.key);
			$(tr).addClass("dragging");
		})._on("dragend",function tr_dragStart(event){
			$(this.parentNode).removeClass("dragging");
		})._on("dragover",function tr_dragOver(event){
			event.preventDefault();
			event.dataTransfer.dropEffect="move";
			var tr=$(this.parentNode);
			if(event.clientY-tr.position().top>tr.height()/2){
				tr.removeClass("insert-before").addClass("insert-after");
			}else{
				tr.addClass("insert-before").removeClass("insert-after");
			}
		})._on("dragleave",function tr_dragLeave(event){
			event.preventDefault();
			$(this.parentNode).removeClass("insert-before insert-after");
		})._on("drop",function tr_drop(event){
			event.stopPropagation();
			var tr=$(this.parentNode),
				key=event.dataTransfer.getData("text/plain"),
				from=$('tr[data-key="'+key+'"]');
			if(from.length&&tr[0]!==from[0]){
				from.addClass("moved");
				if(tr.hasClass("insert-before")){
					tr.before(from);
				}else{
					tr.after(from);
				}
			}
			tr.removeClass("insert-before insert-after");
		});
		
		$("tr td[axis=key]",tbody)._on("dblclick",function(event){
			event.preventDefault();
			if(this.contentEditable=="true"){return;}
			this.contentEditable="true";
			this.focus();
		})._on("blur",function(event){
			this.contentEditable="inherit";
		}).on("keydown",cell_keyDown)._on("input",key_change);
	}
	function renderValues(thead,tbody,props,locale){
		var trs=$("tr",tbody),lang=locale.replace("_","-"),
			cells=[];
		createElement("th",{"data-locale":locale,innerText:locale},thead.rows[0]);
		trs.toArray().forEach(function(tr){
			var key=tr.dataset.key,
				text=props.hasOwnProperty(key)?props[key]:"",
				td=createElement("td",{
					lang:lang,
					innerText:text,
					"data-text":text,
					"contentEditable":"true"
				},tr);
			cells.push(td);
		});
		$(cells)._on("keydown",cell_keyDown)._on("input",cell_textChange);
	}
	function resetLocales(){
		$(table.tBodies[0]).empty();
		i18n.locales.forEach(function(locale,index,locales){
			renderLocale(locale,locales[locale]);
		});
		adjustFooter();
	}
	function renderLocale(locale,props){
		var thead=table.tHead,tbody=table.tBodies[0];
		if(i18n.locales.length<2){
			renderKeys(thead,tbody,props);
		}
		renderValues(thead,tbody,props,locale);
	}
	function processData(obj){
		var props=Object.flatten(obj);
		i18n.locales.push(obj._locale);
		i18n.locales[obj._locale]=props;
		renderLocale(obj._locale,props);
	}
	function adjustFooter(){
		var tfoot=table.tFoot,
			cols=table.rows[0].cells.length;
		$("td:first-child",tfoot).prop("colspan",cols);
	}
	function loadFiles(obj){
		var locales=obj._locales,l=locales.length,i,
			url=jsonService,data;
		for(i=0;i<l;i++){
			data={contextPath:jsonSource,locale:locales[i]};
			$.ajax(url,{
				async:false,
				type:"POST",
				dataType:"json",
				data:data
			}).done(processData);
		}
		adjustFooter();
	}
	function boot(){
		$.ajax(jsonSource.replace("$1/",""),{
			type:"POST",
			dataType:"json",
			data:{}
		}).done(loadFiles);
	}
	boot();
	
	//defer
	function prepareData(){
		var thead=table.tHead,tbody=table.tBodies[0],
			rowModified=$("tr.modified,tr.moved",tbody).length>0,
			data={},locales=[];
		$("th:nth-child(n+3)",thead).toArray().forEach(function(th){
			var locale=th.dataset.locale,
				lang=locale.replace("_","-"),
				tds=$("td[lang="+lang+"]",tbody),
				msg={},
				state="";
			tds.toArray().forEach(function(td){
				msg[td.parentNode.dataset.key]=td.dataset.text=td.innerText;
			});
			msg=Object.deepen(msg);
			if(th.dataset.todo=="add"){
				state="+";
				locales.push(state+locale);
				data[locale]=JSON.stringify(msg,null,"\t");
			}else if(rowModified||tds.filter(".modified").length){
				state="*";
				locales.push(state+locale);
				data[locale]=JSON.stringify(msg,null,"\t");
			}
		});
		data.contextPath=jsonSource;
		data.locales=locales.join(",");
		return data;
	}
	function saveFiles(){
		var url="json.jsp",
			data=prepareData();
		if(!data.locales){return;}
		$.ajax(url,{
			async:false,
			type:"POST",
			data:data,
			dataType:"json"
		}).done(function(info){
			console.info(info);
		});
		var thead=table.tHead,tbody=table.tBodies[0];
		$(".modified",tbody).removeClass("modified moved");
		$(".moved",tbody).removeClass("moved");
		$("th[data-state=pending]",thead).each(function(index,th){
			delete th.dataset.todo;
		});
		$(".button-remove",tbody).remove();
	}
	$(window)._on("keydown",function(event){
		var key=event.keyCode;
		if(key===Keys.BACKSPACE){
			event.preventDefault();
		}else if(event.ctrlKey&&key===Keys.S){
			event.preventDefault();
			saveFiles();
		}
	});
	$("#btn_saveChanges")._on("click",function(event){
		saveFiles();
	});
	$("#btn_addLocale").on("click",function addLocale_click(event){
		addLocale();
	});
	$("#btn_addRow")._on("click",function addRow_click(event){
		addRow();
	});
	$("#btn_reset")._on("click",function addRow_click(event){
		resetLocales();
	});
};
jQuery(init);
