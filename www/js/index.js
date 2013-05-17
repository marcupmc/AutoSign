//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//  
//                                 
//                       
//             /Nd:             				                                      ________________ 
//           :dMMMMh-           				                                     |
//         :dMMMMMMMMd:         					                                 | 
//       +mMMMMMMMMMMMMm+`      				                                     |                     *** 
//    `oNMMMMMMMMMMMMMMMMMy`    				                                     |                     ***  
//   `mMMMMMMMMMMMMMMMMMMMMN.   				_____________    _____________       |                              __________          _
//   +MMMMMMMMMMMMMMMMMMMMMMo  | 			 |   	  |         |			  |      |_______________       |      |                   | \       |
//   /MMMMMMMMMMMMMMMMMMMMMMo  |             |        |         |             |                      |      |      |          		   |  \      |
//    dMMMMMMMMMMMMMMMMMMMMh   |             |        |         |             |                      |      |      |                   |   \     |
//     +mMMMMMMMMMMMMMMMMd/    |             |        |         |             |                      |      |      |       ______      |    \    |
//       .:+++/NMMM/://-`      |             |        |         |             |                      |      |      |             |     |     \   |
//            yMMMMd`          |             |        |         |             |                      |      |      |             |     |      \  |
//           /yyyyyyo`         |_____________|        |         |_____________|      ________________|      |      |_____________|     |       \_|
//
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// CapGemini ECM3 - AutoSign
//
// SCRIPT de la page index.html
//
//
// INFO : 
// IP LOCALHOST : 10.0.2.2:8080
//
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------


//-------------VARIABLES GLOBALES---------------------------------------------------------------------------------------------------------------------------------------------------------

var serviceURL;

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------


//------------FONCTIONS----------------------------------------------------------------------------------------------------------------------------------------------------------

//Fonction appelé au chargement de la page qui permet d'authentifier l'utilisateur
$(document).ready( function () { 
	var ipAddresse  = myIP();
	$("#connexionForm").append("<input type=\"hidden\" name=\"ipClient\" id=\"ipClient\" value=\""+ipAddresse+" \"/>");
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
						window.localStorage.setItem("identifiant", msg);
						document.location.href="home.html?id="+msg+"";
					}
				}
			});
			return false; 
		}
	});

});  


function myIP() {
    if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
    else xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");

    xmlhttp.open("GET","http://api.hostip.info/get_html.php",false);
    xmlhttp.send();

    hostipInfo = xmlhttp.responseText.split("\n");

    for (i=0; hostipInfo.length >= i; i++) {
        ipAddress = hostipInfo[i].split(":");
        if ( ipAddress[0] == "IP" ) return ipAddress[1];
    }

    return false;
}

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------

//Permet de sauvegarder l'ip dans le local storage de l'application
function saveIp(){
	window.localStorage.setItem("ip", $("#ipadress").val());
	$('#popupLogin').popup("close");
}

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------
