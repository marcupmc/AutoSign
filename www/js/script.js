//var serviceURL = "http://10.0.2.2:8080/TestRest/rest/";
//var urlServlet = "http://10.0.2.2:8080/TestRest/";

var serviceURL;//= "http://192.168.0.103:8080/TestRest/rest/";
var urlServlet ;//= "http://192.168.0.103:8080/TestRest/";

var documents=[];
var nbToSign=0;
var identifiant;
var idToSign;
var signatureBase64;
var browser;
var $sigDiv = null;

//------------Objet Document------------------------------------------
function Document(id,nom,estCertifie,url) { 
	this.id=id;
	this.nom=nom;
	this.estCertifie=estCertifie;
	this.url=url;
} 
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------


//Au lancement de la page
$(document).ready( function () { 
	if(window.localStorage.getItem("identifiant")==-1){
		document.location.href="index.html";
		alert('Veuillez vous authentifier');
	}
	else if(window.localStorage.getItem("ip")==-1)	{
		document.location.href="index.html";
		alert('Veuillez configurer l\'ip du serveur');
	}else{
		
		serviceURL="http://"+window.localStorage.getItem("ip")+"/TestRest/rest/";
		urlServlet="http://"+window.localStorage.getItem("ip")+"/TestRest/";
		
		$sigDiv=$("#signature").jSignature();
		var temp =location.search.split("=");
		identifiant = unescape(temp[1]);
		var serializedData = identifiant;
		$.ajax({ 
			type: "POST", 
			url: serviceURL+"importation",
			data: serializedData,
			datatype:"jsonp",
			success: function(msg){ 
				var pdfs  = $.parseJSON(msg);
				listePDF = pdfs.pdf;
				var firstnameUser  =pdfs.firstName;
				var lastnameUser =  pdfs.lastName;
				$("#welcome").append("Bonjour "+firstnameUser +" "+lastnameUser );
				for(i=0;i<listePDF.length;i++)
				{
					var doc  = new Document(listePDF[i].id,listePDF[i].name, listePDF[i].isCertified, listePDF[i].url);
					documents.push(doc);
					if(!listePDF[i].isCertified)nbToSign++;
				}

				$("#num_tosign").text(nbToSign);
				if(pdfs.signature=="null"){	
					$("#img_signature").append("<div id=\"message\" class=\"alert alert-info\"><p>Aucune signature enregistrée. " +
					"Pour saisir votre signature, cliquez sur \"Editer votre signature\"</p></div>");
				}else{ 
					$("#img_signature").append("<img id=\"signature\" src=\"data:image/png;base64,"+pdfs.signature+"\"/>");
				}
			}

		});
	}
}); 

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------

//Permet de déconnecter l'utilisateur
function  deconnexion(){
	window.localStorage.setItem("identifiant",-1);
	alert('Deconnexion réussie !');
	document.location.href="index.html";
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------------------

//Permet d'effacer la signature de la zone de saisie
function closeSignature(){
	$sigDiv.jSignature("reset");
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------------------

//Permet d'envoyer l'image de la signature au serveur
function sendSignature(){
	var datapair = $sigDiv.jSignature("getData", "image");
	signatureBase64 = datapair[1];
	$("#sendSignature").append(
			"<form name=\"sendSign\" id=\"sendSign\">" +
			"<input type=\"hidden\" id=\"idClient\" name=\"idClient\" value="+identifiant+" />"+
			"<input type=\"hidden\" id=\"imgSignature\" name=\"imgSignature\" value="+signatureBase64+" />"+
	"</form>");

	var $inputs = $("#sendSign").find("input, select, button, textarea");
	var serializedData = $("#sendSign").serialize();
	$.ajax({ 
		type: "POST", 
		url: serviceURL+"signature",
		data: serializedData, 
		datatype:"string",
		success: function(msg){ 
			if(msg=="error") {
				alert('La signature n a pas été enregistrée');
				return false;
			}
			else{
				$sigDiv.jSignature("reset");
				$('#popupLogin').popup("close");
				$("#img_signature").empty();
				$("#img_signature").append("<img id=\"signature\" src=\"data:image/png;base64,"+signatureBase64+"\"/>");
				alert( 'Sauvegarde réussie ! ');
				return false;
			}
		}
	});
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------



function showListe(){
	$("#accueil").css("display","none");
	$("#liste_all").empty();
	$("#liste_Tous").css("display","none");

	$("#documents").empty();
	$("#liste_document").fadeIn("slow");

	$("#pdf_reader").css("display","none");
	$("#certifier").css("display","none");

	for(key in documents){
		if(!documents[key].estCertifie){
			$("#documents").append("<li onclick=\"showPDF("+key+")\" data-theme=\"c\"><a href=\"#\">"+documents[key].nom+"</a></li>").listview('refresh');
		}
	}
}

function showAll(){
	$("#documents").empty();
	$("#liste_document").css("display","none");
	$("#accueil").css("display","none");

	$("#pdf_reader").css("display","none");
	$("#certifier").css("display","none");

	$("#liste_all").empty();
	$("#liste_Tous").fadeIn("slow");

	for(key in documents){
		if(documents[key].estCertifie)
			$("#liste_all").append("<li onclick=\"showPDF("+key+")\" data-theme=\"c\"><a href=\"#\"><img src=\"img/cadenas.png\" alt=\"ok\" class=\"ui-li-icon\">"+documents[key].nom+"</a></li>").listview('refresh');
		else
			$("#liste_all").append("<li onclick=\"showPDF("+key+")\" data-theme=\"c\"><a href=\"#\">"+documents[key].nom+"</a></li>").listview('refresh');
	}
}

function showPDF(key){
	$("#accueil").css("display","none");
	$("#pdf_reader").empty();
	idToSign =documents[key].id;
	$("#liste_document").css("display","none");
	$("#liste_Tous").css("display","none");
	$("#pdf_reader").append("<iframe width=100% height=100% " +
			"src=\"http://docs.google.com/viewer?url="+documents[key].url+"\""+
	"id=\"content1\" name=\"content1\"></iframe>");

	$("#pdf_reader").fadeIn("slow");
	if(!documents[key].estCertifie)
		$("#certifier").fadeIn("slow");
}

function close(){
	$('.ui-dialog').dialog('close');
}

//Démarre la certification des documents
function beginCertification(){
	console.log('------ DEBUT CERTIF----');
	callRestToTemporisation();
	ref = window.open(urlServlet+"CertifierDocument?identifiant="+identifiant+"&id="+idToSign, '_blank', 'location=no');

}


//Appel la fonction qui verifie si le document est certifié sur le serveur
function callRestToTemporisation(){
	console.log('------ DEBUT Tempo : '+idToSign+'----');
	$.ajax({ 
		type: "POST", 
		url: serviceURL+"temporisation",
		data: idToSign.toString(), 
		dataType: "text",
//		async:true,

		success: function(msg){
			if(msg=="ok"){
				console.log('------ END Tempo ----');
				ref.close();
				document.location.href="home.html?id="+identifiant+"";
			}
			else{
				console.log('------ NOT YET Tempo----');
				callRestToTemporisation();
			}
		}
	});
	return false;
}


//Genere le diviseur de liste avec le champs de recherche
$("#liste_all").listview({
	autodividers: true,
});