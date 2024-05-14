function contribution_addEventListeners()
{

  // loginbox
  $('#username').on("keyup", function(e) {if (e.keyCode == 13) {$("#loginBox_button").click();}});

  // newpassword/resetpass
  $('#usernamereset').on("keyup", function(e) {if (e.keyCode == 13) {$("#newpassword_button").click();}});

  // userexists
  $('#UserExistslogin_username').on("keyup", function(e) {if (e.keyCode == 13) {$("#UserExistslogin_button").click();}});
  $('#UserExistslogin_password').on("keyup", function(e) {if (e.keyCode == 13) {$("#UserExistslogin_button").click();}});

  // new git user
  $('#newGit-UserCreation_username').on("keyup", function(e) {if (e.keyCode == 13) {$("#newGit-UserCreation_button").click();}});
  $('#newGit-UserCreation_password1').on("keyup", function(e) {if (e.keyCode == 13) {$("#newGit-UserCreation_button").click();}});
  $('#newGit-UserCreation_password2').on("keyup", function(e) {if (e.keyCode == 13) {$("#newGit-UserCreation_button").click();}});


}

function contribution_newGitUserCreation()
{
  $("#newGit-UserCreation_username").val($("#username").val());

  $("#login").css("display","none");
  $("#newpassword").css("display","none");
  $("#UserExistslogin").css("display","none");
  
  $("#newGit-UserCreation").css("display","");

  $("#newGit-UserCreation_password1").focus();     


}


function contribution_resetLoginStatus() // return to initial login
{
  contribution_resetFields();
  $("#UserExistslogin").css("display","none"); 
  $("#newGit-UserCreation").css("display","none"); 
  $("#newpassword").css("display","none");

  $("#login").css("display",""); 
  $("#username").focus();     

}


function contribution_resetFields()
{
  $("#login #username").val("");
	$("#login #password").val("");
  $("#usernamereset").val("");
	$("#UserExistslogin_username").val("");
	$("#UserExistslogin_password").val("");
  $("#NewGit-UserCreation_username").val("");
  $("#newGit-UserCreation_password1").val("");
  $("#newGit-UserCreation_password2").val("");
}

function contribution_userExistsLogin()
{
  $("#UserExistslogin_username").val($("#username").val());
  
  $("#login").css("display","none");
  $("#newGit-UserCreation").css("display","none");
  $("#newpassword").css("display","none");

  $("#UserExistslogin").css("display",""); 

  $("#UserExistslogin_password").focus();     

  
}

function contribution_showLoginPopup()
{
  contribution_addEventListeners();
  $("#login").css("display",""); // show inital login box
  $("#formBox").css("display","flex"); // show background
  $("#username").focus();     
}

function returned_git_user_login(data)
{
  if(data['success'])
    window.location.reload(true);  // TODO should I just reload the page here perhaps? 
  else if(data['status'] == "wrong pass")
  {
    displayAlertText("#UserExistslogin_message", "Invalid password <br />");

    $("#UserExistslogin_password").addClass("loginFail");

    setTimeout(function()
    {
      $("#UserExistslogin_password").removeClass("loginFail");
      displayAlertText("#UserExistslogin_message", "Try again");

      setTimeout(() => {
        displayAlertText("#UserExistslogin_message", "");
      }, 2000);


    }, 2000);
  }
  else if(data['status'] == "revoked")
  {
    displayAlertText("#UserExistslogin_message", "User revoked <br />");

    $("#UserExistslogin_password").addClass("loginFail");

    setTimeout(function()
    {
      $("#UserExistslogin_password").removeClass("loginFail");
      displayAlertText("#UserExistslogin_message", "");


    }, 2000);
  }
  else if(data['status'] == "pending")
  {
    displayAlertText("#UserExistslogin_message", "User pending <br />");

    $("#UserExistslogin_password").addClass("loginFail");

    setTimeout(function()
    {
      $("#UserExistslogin_password").removeClass("loginFail");
      displayAlertText("#UserExistslogin_message", "");

    }, 2000);
  }
}


function contribution_git_processLogin()
  {
    let git_username = $("#UserExistslogin_username").val();
    let git_password = $("#UserExistslogin_password").val();

    

    AJAXService("requestContributionUserLogin", 
    {username: git_username, userpass: git_password, return: returned_git_user_login}, "CONT_LOGINBOX_SERVICE");

  }

function git_logout()
{
  
  let git_username = null; // nothing entered will logout
  let git_password = null;


    AJAXService("requestContributionUserLogin", 
    {username: git_username, userpass: git_password, return: returned_git_user_login}, "CONT_LOGINBOX_SERVICE");

}

{ // scope for local-storage of in-between function variables

    let userExists_Git = null; // if it exists in the git data
    let userExists_Lenasys = null; // if it exists in the lenasys data
    let userStatus_Lenasys = null; // if it is a super/teache
   
    function checkIfGitUserExists(username, _callback) // checks if user exists in the git data and or the lenasys data
  {
    userExists_Git = null; // reset back to null if we want to do a check for another user
    userExists_Lenasys = null;
    userStatus_Lenasys = null;
  
    if(username == null || username == "" || !(typeof(username) === 'string'))
    {
      toast("error", "invalid input of username", 10);
    }
    else
    {

        AJAXService("checkForGitUser", 
        {userid: username, return: returned_git_user_check}, "CONT_LOGINBOX_SERVICE");
  
        // ##############################


        AJAXService("checkForLenasysUser", 
        {userid: username, return: returned_lenasys_user_check}, "CONT_LOGINBOX_SERVICE");

    
  
        function checkAsyncFlags() 
        {
          if(userExists_Git == null || userExists_Lenasys == null || userStatus_Lenasys == null) 
          {
             window.setTimeout(checkAsyncFlags, 100);
          } else 
          {
            _callback(userExists_Git,userExists_Lenasys, userStatus_Lenasys);
  
          }
        }
        checkAsyncFlags();
  
          
    }   
  
    }
  
    function contribution_requestGitUserCreation() // function to create the git user in the lenasys database, make sure requestedpasswordchange is pending(101)
    {
    
      let pass1 = document.querySelector("#newGit-UserCreation_password1").value;
      let pass2 = document.querySelector("#newGit-UserCreation_password2").value;
      let username = document.querySelector("#newGit-UserCreation_username").value;
      // TODO MAKE SURE PASSWORD IS ACTUALLY VALID BEFORE INSERT INTO DB
      let regexVert = /[a-z|A-Z|0-9]+$/;
  
      if(pass1 == pass2)
      {
        if(!(pass1 != null && pass1 != ""))
        {
  
          displayAlertText("#newGit-UserCreation_message", "invalid password <br />");
  
          $("#newGit-UserCreation_password1").addClass("loginFail");
              $("#newGit-UserCreation_password2").addClass("loginFail");
                setTimeout(function()
            {
                  $("#newGit-UserCreation_password1").removeClass("loginFail");
              $("#newGit-UserCreation_password2").removeClass("loginFail");
  
              setTimeout(() => {
                displayAlertText("#newGit-UserCreation_message", "");
              }, 2000);
  
                    }, 2000);
        }
        else if(!(regexVert.test(pass1) && pass1.length < 64 && pass1.length>= 8)){
          displayAlertText("#newGit-UserCreation_message", `invalid password, needs to be: <br />
            *between 8 and 64 characters <br />
            * A-Z, a-z  or numbers <br/>`);
          $("#newGit-UserCreation_password1").addClass("loginFail");
              $("#newGit-UserCreation_password2").addClass("loginFail");
                setTimeout(function()
            {
                  $("#newGit-UserCreation_password1").removeClass("loginFail");
              $("#newGit-UserCreation_password2").removeClass("loginFail");
            
              setTimeout(function()
              {
                 displayAlertText("#newGit-UserCreation_message", '');
              },2000)
            
                    }, 2000); 
        }
        else
        {

            AJAXService("requestGitUserCreation", 
            {userid: username, userpass: pass1, return: returned_lenasys_user_creation}, "CONT_LOGINBOX_SERVICE");

            
        }
      }
      
      else
      {
        displayAlertText("#newGit-UserCreation_message", "password doesnt match <br />");
  
        $("#newGit-UserCreation_password1").addClass("loginFail");
              $("#newGit-UserCreation_password2").addClass("loginFail");
                setTimeout(function()
          {
                $("#newGit-UserCreation_password1").removeClass("loginFail");
            $("#newGit-UserCreation_password2").removeClass("loginFail");
  
            setTimeout(() => {
              displayAlertText("#newGit-UserCreation_message", "");
            }, 2000);
  
  
                  }, 2000);
      }
      
    }
  
    function returned_lenasys_user_creation(data)
    {
  
      if(typeof data == "boolean") // check so that the type is correct
      {
        if(data == false) // didnt create user
        {
          displayAlertText("#newGit-UserCreation_message", "could not create user <br />");
  
          $("#newGit-UserCreation_username").addClass("loginFail");
              $("#newGit-UserCreation_password1").addClass("loginFail");
          $("#newGit-UserCreation_password2").addClass("loginFail");
  
                setTimeout(function()
          {
                $("#newGit-UserCreation_username").removeClass("loginFail");
            $("#newGit-UserCreation_password1").removeClass("loginFail");
            $("#newGit-UserCreation_password2").removeClass("loginFail");
  
            displayAlertText("#UserExistslogin_message", "");
            contribution_resetLoginStatus();
                  }, 2000);
        }
        else // created user
        {
  
          $("#newGit-UserCreation_username").addClass("loginPass");
              $("#newGit-UserCreation_password1").addClass("loginPass");
          $("#newGit-UserCreation_password2").addClass("loginPass");
                setTimeout(function()
          {
                $("#newGit-UserCreation_usernam").removeClass("loginPass");
            $("#newGit-UserCreation_password1").removeClass("loginPass");
            $("#newGit-UserCreation_password2").removeClass("loginPass");
            contribution_resetLoginStatus();
                  }, 2000);
        }
      }
      else
        toast("error","invalid data returned from git-data", 10);
  
    }
  
  
  
  
    function returned_git_user_check(data)
    {
      if(typeof data == "boolean") // check so that the type is correct
      {
        userExists_Git = data;
      }
      else
        toast("error","invalid data returned from git-data", 10);
  
      return userExists_Git;
  
    }
  
    function returned_lenasys_user_check(data)
    {
      userExists_Lenasys = Boolean(data['success']);
      userStatus_Lenasys = data['status'];
      return userExists_Lenasys;
    }
    
    function contribution_loginGitOrUser_Check()
  
    {
      let loginBoxheader_login_username_field = document.querySelector("#username");
      let username = loginBoxheader_login_username_field.value;
  
      if(username === "") // we do a simple check if the string is empty to not call backend if nothing is entered.
      {
        console.log("nothing entered");
      } 
      else
      {
  
        checkIfGitUserExists(username ,function(_onGit, _onLena, _userStatus) 
          {
            
  
            /*
              There exists a number of combinations that we need to handle¨
  
              onGit | onLena
              --------------
                T   |  T    -> Log in with lena
                F   |  T    -> Log in with lena
                T   |  F    -> Create new user
                F   |  F    -> User does not exist
            */
  
            if(_onLena) // log in with lena
            {
              if(_userStatus == "super" || _userStatus == "student") // if youre a teacher or youre a student with a created git account on the git_user table
              { 
                contribution_userExistsLogin();
              }
              else // youre on solely lena but not a teacher/super
              {
                displayAlertText("#login #message", "User does not have permission <br />");
  
                $("input#username").addClass("loginFail");
                      $("input#password").addClass("loginFail");
                      setTimeout(function()
                {
                        $("input#username").removeClass("loginFail");
                  $("input#password").removeClass("loginFail");
                  displayAlertText("#login #message", "Try again");

                    setTimeout(() => {
                      displayAlertText("#login #message", ""); // hide it
                    }, 2000);


                          }, 2000);
              }
            }
            if(!_onLena && _onGit) // onlena is false, ongit true, create new user
            {
              contribution_newGitUserCreation();
  
            }
            if(!_onLena && !_onGit)
            { // default to user does not exist if nothing else
              displayAlertText("#login #message", "User does not exist <br />");
  
              $("input#username").addClass("loginFail");
                    $("input#password").addClass("loginFail");
                    setTimeout(function()
              {
                      $("input#username").removeClass("loginFail");
                $("input#password").removeClass("loginFail");
                displayAlertText("#login #message", "Try again");

                setTimeout(() => {
                  displayAlertText("#login #message", ""); // hide it
                }, 2000);

                }, 2000);
  
            }
          });    
      }
    }
}

function git_showLogoutPopup()
{
  $("#git_logoutBox").show();
}


function CONT_LOGINBOX_SERVICE_RETURN(data)
{
    let returnData = JSON.parse(data["returnData"]);
    let returnMethod = data["returnMethod"];


    if(returnMethod == returned_git_user_login)
    {
        returned_git_user_login(returnData);
    }
    else if(returnMethod == returned_lenasys_user_check)
    {
        returned_lenasys_user_check(returnData);
    }
    else if(returnMethod == returned_git_user_check)
    {
        returned_git_user_check(returnData);
    }
    else if(returnMethod == returned_lenasys_user_creation)
    {
        returned_lenasys_user_creation(returnData);
    }

}


{ // scope to hold variable saying if we are on the loaded page or not, 
  let contribution_loaded = true; // gets set in contribution, true by default
  function set_contribution_loaded(_input) // i gave it a set function as we cant modify contribution_loaded in global function space but i dont want contribution_loaded to be exposed to global scope either
  {
    contribution_loaded = _input;
  }

  function contribution_closeLogin() 
  {
    // this login exists both on the fully loaded contribution page and the page that prompts you to login, 
    // on the fully loaded page we dont want to return to home but instead simply close it, on the prompted page we return to home

    if(contribution_loaded)
    {
      console.log("not yet implemented");
    }
    else // you got prompted, this will return to courseed, aka homepage of sorts
    {
      window.location.href = "courseed.php"; 
    }


  }
}



console.error