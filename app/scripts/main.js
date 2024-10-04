import { GooglesignInUser, NormalRegisterUser, NormalSignInUser } from "../modules/users.js";



var submit_btn = document.getElementById("submit-btn");
const full_form = document.getElementById("full-form");
const heading = document.getElementById("header");
const SwitchDivTag = document.getElementById("Switch");
const googleBtn = document.getElementById("google-login");


var registration = false;
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


function showRegistrationInputs(){
  registration = true;
  signin = false;
  if(full_form.querySelector('input[id="firstName_text"]')){
    return;
  }
  if(full_form.querySelector('input[id="email-input"]')){
    document.getElementById('email-input').remove();
    document.getElementById('password_text').remove();
    document.getElementById('RegisterLink').remove();
    document.getElementById('RegisterText').remove();
    document.getElementById('Switch').remove();
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
  if(full_form.querySelector('input[id="email-input"]')){
    return;
  }
  if(full_form.querySelector('input[id="confirmPassword_text"]')){
    document.getElementById('firstName_text').remove();
    document.getElementById('email_text').remove();
    document.getElementById('password_text').remove();
    document.getElementById('confirmPassword_text').remove(); 
    document.getElementById('Switch').remove();
    document.getElementById('lastName_text').remove();
  }
  submit_btn.remove();
  


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



function verifyRegisterFields(f, l, e, p, cp, pTag){
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
  }

  if(missing){
    pTag.innerText = '*Fill in all Fields';
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
      if(verifyRegisterFields(firstName.value, lastName.value, email.value, password.value,confirmPassword.value, message)){
        if(await NormalRegisterUser(firstName.value, lastName.value, email.value, password.value, message)){
          window.location.href = "https://agreeable-forest-0b968ac03.5.azurestaticapps.net/edit-profile.html"
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
          window.location.href = "http://127.0.0.1:5500/dashboardtest.html"
        }
      }
    }

});
}

googleBtn.addEventListener('click', async ()=>{
    //GooglesignInUser();
    if(await GooglesignInUser()){
          window.location.href = "http://127.0.0.1:5500/dashboardtest.html"
    }
  
});





window.onload = showLogInFields;

export{ smoothTRansition}
