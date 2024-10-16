import { GooglesignInUser, NormalRegisterUser, NormalSignInUser, resetPassword  } from "../modules/users.js";



var submit_btn = document.getElementById("submit-btn");
const full_form = document.getElementById("full-form");
const heading = document.getElementById("header");
const SwitchDivTag = document.getElementById("Switch");
const googleBtn = document.getElementById("google-login");


var registration = false;
var passwordReset = false;
var signin = true;
var waiting = false;


function smoothTRansition(){
    // Get the current height of the article
    const currentHeight = full_form.clientHeight;

    // Temporarily set the height to auto to get the new height
    full_form.style.height = 'auto';
    const newHeight = full_form.scrollHeight;

    // Reset to original height, then set to new height to trigger transition
    full_form.style.height = `${currentHeight}px`;
    setTimeout(() => {
        full_form.style.height = `${newHeight}px`;
    }, 10);

}

function showResetPassword(){
  registration = false;
  signin = false;
  passwordReset = true;
  if(full_form.querySelector('input[id="InformationLink"]')){
    return;
  }
  if(full_form.querySelector('input[id="email-input"]')){
    document.getElementById('email-input').remove();
    document.getElementById('password_text').remove();
    document.getElementById('RegisterLink').remove();
    document.getElementById('RegisterText').remove();
    document.getElementById('Switch').remove();
    document.getElementById('ResetPassword').remove();
  }
  submit_btn.remove();

  header.innerText = "Reset Password";


  const forgotPassword = document.createElement('p');
  forgotPassword.className = "InformationLink show";
  forgotPassword.id = "InformationLink";
  forgotPassword.innerText = "Please provide your email that you registered with. A link to reset your password will be sent to this email. If you logged in with google, please click the google button.";
  forgotPassword.style.cursor = 'pointer';
  //forgotPassword.onclick = showRegistrationInputs;
  forgotPassword.addEventListener('click',()=>{
    showResetPassword();
  })
  full_form.appendChild(forgotPassword);


  const  firstName_text = document.createElement('input');
  firstName_text.type = 'text';
  firstName_text.id = 'resetEmail';
  firstName_text.className = 'add';
  firstName_text.placeholder = 'Email *';
  firstName_text.required;
  full_form.appendChild(firstName_text);


  submit_btn.innerText = 'Send Link';
  full_form.appendChild(submit_btn);


  const SwitchDiv = document.createElement('div');
  SwitchDiv.className = "Switch";
  SwitchDiv.id = "Switch";

  const loginSwitch = document.createElement('div');
  loginSwitch.id = "LoginSwitch";
  loginSwitch.className = "LoginSwitch";

  const pTag1 = document.createElement('p');
  pTag1.id = "LoginText";
  pTag1.className = "LoginText show";
  pTag1.innerText = "Already Registered?";
  loginSwitch.appendChild(pTag1);

  const pTag2 = document.createElement('p');
  pTag2.className = "LoginLink show";
  pTag2.id = "LoginLink";
  pTag2.innerText = "Login";
  pTag2.style.cursor = 'pointer';
  pTag2.onclick = showLogInFields;
  loginSwitch.appendChild(pTag2);

  SwitchDiv.appendChild(loginSwitch)
  full_form.appendChild(SwitchDiv);
}


function showRegistrationInputs(){
  //resetPassword("2508872@students.wits.ac.za");
  registration = true;
  signin = false;
  passwordReset = false;
  if(full_form.querySelector('input[id="firstName_text"]')){
    return;
  }
  if(full_form.querySelector('input[id="email-input"]')){
    document.getElementById('email-input').remove();
    document.getElementById('password_text').remove();
    document.getElementById('RegisterLink').remove();
    document.getElementById('RegisterText').remove();
    document.getElementById('RegisterSwitch').remove();
    document.getElementById('Switch').remove();
    document.getElementById('ResetPassword').remove();
  }
  submit_btn.remove();


  header.innerText = "Registration";

  const message = document.createElement('p');
  message.id = 'inform';

  full_form.appendChild(message);
        
  const  firstName_text = document.createElement('input');
  firstName_text.type = 'text';
  firstName_text.id = 'firstName_text';
  firstName_text.className = 'add';
  firstName_text.placeholder = 'First Name *';
  firstName_text.required;
  full_form.appendChild(firstName_text);

  const  lastName_text = document.createElement('input');
  lastName_text.type = 'text';
  lastName_text.id = 'lastName_text';
  lastName_text.className = 'add';
  lastName_text.placeholder = 'Last Name *';
  lastName_text.required;
  full_form.appendChild(lastName_text);

  const email_text = document.createElement('input');
  email_text.type = 'email';
  email_text.id = 'email_text';
  email_text.className = 'add';
  email_text.placeholder = 'Email *';
  email_text.required;
  full_form.appendChild(email_text);

  const genderSelect = document.createElement('select');
  genderSelect.id = "GenderSelect"
  genderSelect.className = "GenderSelect"

  const placeholderOption = document.createElement("option");
  placeholderOption.value = "";
  placeholderOption.disabled = true;
  placeholderOption.selected = true;
  placeholderOption.textContent = "Gender";
  genderSelect.appendChild(placeholderOption);

  const MaleOption = document.createElement('option');
  MaleOption.value = "Male";
  MaleOption.innerText = "Male"

  const FemaleOption = document.createElement('option');
  FemaleOption.vale = "Female";
  FemaleOption.innerText = "Female";

  const OtherOption = document.createElement('option');
  OtherOption.vale = "Other"
  OtherOption.innerText = "Other"

  genderSelect.appendChild(MaleOption);
  genderSelect.appendChild(FemaleOption);
  genderSelect.appendChild(OtherOption);
  full_form.appendChild(genderSelect);

  genderSelect.addEventListener('change', ()=>{
    genderSelect.style.color = "black";
  });

  const pass1 = document.createElement('input');
  pass1.type = 'password';
  pass1.id = 'password_text';
  pass1.className = 'add';
  pass1.placeholder = 'password *';
  full_form.appendChild(pass1);

  const pass2 = document.createElement('input');
  pass2.type = 'password';
  pass2.id = 'confirmPassword_text';
  pass2.className = 'add';
  pass2.placeholder = 'confirm password *';
  full_form.appendChild(pass2);

  submit_btn.innerText = 'Register';
  full_form.appendChild(submit_btn);

  const SwitchDiv = document.createElement('div');
  SwitchDiv.className = "Switch";
  SwitchDiv.id = "Switch";

  const loginSwitch = document.createElement('div');
  loginSwitch.id = "LoginSwitch";
  loginSwitch.className = "LoginSwitch";

  const pTag1 = document.createElement('p');
  pTag1.id = "LoginText";
  pTag1.className = "LoginText show";
  pTag1.innerText = "Already Registered?";
  loginSwitch.appendChild(pTag1);

  const pTag2 = document.createElement('p');
  pTag2.className = "LoginLink show";
  pTag2.id = "LoginLink";
  pTag2.innerText = "Login";
  pTag2.style.cursor = 'pointer';
  pTag2.onclick = showLogInFields;
  loginSwitch.appendChild(pTag2);

  SwitchDiv.appendChild(loginSwitch)
  full_form.appendChild(SwitchDiv);
}


function showLogInFields(){
  registration = false;
  signin = true;
  passwordReset = false;
  if(full_form.querySelector('input[id="email-input"]')){
    return;
  }

  // Remove the registration stuff if it is there
  if(full_form.querySelector('input[id="confirmPassword_text"]')){
    document.getElementById('firstName_text').remove();
    document.getElementById('email_text').remove();
    document.getElementById('password_text').remove();
    document.getElementById('confirmPassword_text').remove();
    document.getElementById('LoginSwitch').remove(); 
    document.getElementById('Switch').remove();
    document.getElementById('lastName_text').remove();
    document.getElementById('GenderSelect').remove()
  }
  submit_btn.remove();

  // Remove the password Reset if it is there
  if(full_form.querySelector('input[id="resetEmail"]')){
    document.getElementById('InformationLink').remove();
    document.getElementById('resetEmail').remove();
    document.getElementById('LoginLink').remove();
    document.getElementById('LoginText').remove(); 
    document.getElementById('LoginSwitch').remove();
    document.getElementById('Switch').remove();
  }
  


  header.innerText = "Sign-In";

  const message = document.createElement('p');
  message.id = 'inform';
  message.className = 'message';

  full_form.appendChild(message);

  const email_text = document.createElement('input');
  email_text.type = 'email';
  email_text.id = 'email-input';
  email_text.className = 'add';
  email_text.placeholder = 'Email *';
  email_text.required;
  full_form.appendChild(email_text);

  const password_text = document.createElement('input');
  password_text.type = 'password';
  password_text.id = 'password_text';
  password_text.className = 'add';
  password_text.placeholder = 'Password *';
  password_text.required;
  full_form.appendChild(password_text);
  submit_btn.innerText = 'SIGN IN';
  full_form.appendChild(submit_btn);

  const SwitchDiv = document.createElement('div');
  SwitchDiv.className = "Switch";
  SwitchDiv.id = "Switch";

  const loginSwitch = document.createElement('div');
  loginSwitch.id = "RegisterSwitch";
  loginSwitch.className = "RegisterSwitch";

  const pTag1 = document.createElement('p');
  pTag1.id = "RegisterText";
  pTag1.className = "RegisterText show";
  pTag1.innerText = "Not Registered?";
  loginSwitch.appendChild(pTag1);

  const forgotPassword = document.createElement('p');
  forgotPassword.className = "ResetPassword show";
  forgotPassword.id = "ResetPassword";
  forgotPassword.innerText = "Forgot Password?";
  forgotPassword.style.cursor = 'pointer';
  //forgotPassword.onclick = showRegistrationInputs;
  forgotPassword.addEventListener('click',()=>{
    showResetPassword();
  })
  full_form.appendChild(forgotPassword);


  const pTag2 = document.createElement('p');
  pTag2.className = "RegisterLink show";
  pTag2.id = "RegisterLink";
  pTag2.innerText = "Register";
  pTag2.style.cursor = 'pointer';
  //pTag2.onclick = showRegistrationInputs;
  pTag2.addEventListener('click',()=>{
    showRegistrationInputs();
  })
  loginSwitch.appendChild(pTag2);

  SwitchDiv.appendChild(loginSwitch)
  full_form.appendChild(SwitchDiv);

}



function verifyRegisterFields(f, l, e, p, cp, pTag, g){
  let missing = false;

  if(!f){
    missing = true;
  }else if (!l){
    missing = true;
  }else if(!e){
    missing = true;
  }else if (!p){
    missing = true;
  }else if(!cp){
    missing = true;
  }else if( p !==cp){
    missing = true
  }else if( g == ""){
    missing = true
  }

  if(missing){
    if(p!==cp){
      pTag.innerText = '*Incorrect confirmed password';
    }else{
      pTag.innerText = '*Fill in all Fields';
    }
    
    smoothTRansition();
    // Trigger the transition
    requestAnimationFrame(() => {
      pTag.className = 'message show';
    });
  }

  return !missing;
}



function verifySignInFields(e, p, pTag){
  if(!e){
    pTag.innerText = 'Fill in all Fields';
    smoothTRansition();
    // Trigger the transition
    requestAnimationFrame(() => {
      pTag.className = 'message show';
    });
    return false;
  }
  else if(!p){
    pTag.innerText = '     *Fill in all Fields';
    smoothTRansition();
    // Trigger the transition
    requestAnimationFrame(() => {
      pTag.className = 'message show';
    });
    return false;
  }

  return true;
}


function verifyResetPassword(e){
  if(!e){
    alert("Please provide your email")
    return false
  }

  return true
}


if(submit_btn){
submit_btn.addEventListener("click",async ()=>{
  //Show registration form if user is not registered
  if( registration){
    const firstName = document.getElementById('firstName_text');
    const lastName = document.getElementById('lastName_text');
    const email = document.getElementById('email_text');
    const password = document.getElementById('password_text');
    const confirmPassword = document.getElementById('confirmPassword_text');
    const message = document.getElementById('inform');
    const gender = document.getElementById('GenderSelect');
    if(verifyRegisterFields(firstName.value, lastName.value, email.value, password.value,confirmPassword.value, message, gender.value)){
      if(await NormalRegisterUser(firstName.value, lastName.value, email.value, password.value, message, gender.value)){
        window.location.href = "./edit-profile.html"
        //showLogInFields();
        
      }
    }
  }

  //Show password input text if user is already registered
  if(signin){
    const email = document.getElementById('email-input');
    const password = document.getElementById('password_text');
    const message = document.getElementById('inform');
    if(verifySignInFields(email.value, password.value, message)){
      if(await NormalSignInUser(email.value, password.value, message)){
        window.location.href = "https://agreeable-forest-0b968ac03.5.azurestaticapps.net/dashboardtest.html"
      }
    }
  }

  // This is when the user clicks the email for the reset password
  if(passwordReset){
    const email = document.getElementById('resetEmail');
    if(verifyResetPassword(email.value)){
      if(await resetPassword(email.value)){
        showLogInFields();
      }
    }
    
  }

});}


if(googleBtn){
  googleBtn.addEventListener('click', async ()=>{
//GooglesignInUser();
    if(await GooglesignInUser()){
      window.location.href = "https://agreeable-forest-0b968ac03.5.azurestaticapps.net/dashboardtest.html"
    }

  });
}

function iterateLocalStorage() {
  if (typeof(Storage) !== "undefined") {
      for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          const value = localStorage.getItem(key);
      }
  } else {
      console.log("Local storage is not supported in this browser.");
  }
}

iterateLocalStorage();



window.onload = showLogInFields;

export{ smoothTRansition}
