//var serviceURL = "http://10.0.2.2:8080/TestRest/rest/";

var serviceURL;// = "http://192.168.0.103:8080/TestRest/rest/";


//----------------Variables--------------------------------------------------------------------------------------------------------------------------------------------

//a changer pour la mise en production
//Mettre l'adresse du serveur
//var serviceURL = "http://10.0.2.2:8080/TestRest/rest/";

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------

//Fonction appelé au chargement de la page qui permet d'authentifier l'utilisateur
$(document).ready( function () { 
	$("#connexionForm").submit( function() { 
		if(window.localStorage.getItem("ip")==-1){
			alert("Veuillez configurer l\'ip du serveur");
		}
		else{
			serviceURL="http://"+window.localStorage.getItem("ip")+"/TestRest/rest/";
			var $inputs = $("#connexionForm").find("input, select, button, textarea");
			var serializedData = $("#connexionForm").serialize();
			$.ajax({ 
				type: "POST", 
				url: serviceURL+"authentification",
				data: serializedData, 
				datatype:"string",
				success: function(msg){ 
					if(msg=="error") 
						alert('Veuillez entrer un identifiant et un mot de passe valide');
					else{
//						alert('Authentification réussie ! identifiant : '+msg);
						window.localStorage.setItem("identifiant", msg);
						document.location.href="home.html?id="+msg+"";
					}
				}
			});
			return false; 
		}
	});

});  

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------

function saveIp(){
	window.localStorage.setItem("ip", $("#ipadress").val());
	$('#popupLogin').popup("close");
}