// src/app.js
//It should use src/auth.js to handle authentication, get the user, and update the UI

import { Auth, getUser } from './auth';
import { getUserFragments, postUserFragments, getFragmentById, deleteFragmentById, modifyFragmentById} from './api';


async function init() {
  // Get our UI elements
  const userSection = document.querySelector('#user');
  const loginBtn = document.querySelector('#login');
  const logoutBtn = document.querySelector('#logout');
  const createBtn = document.querySelector('#create');
  const getByIdBtn = document.querySelector('#get');
  const modifyBtn = document.querySelector('#modify');
  const deleteBtn = document.querySelector('#delete');
  const selectedType = document.getElementById('fragmentType');
  const selectedType2 = document.getElementById('fragmentType2');
  const imagePlace = document.getElementById('imagePlaceholder');
  const metadataSection = document.querySelector('#metadataSection');
  const metadataToDisplay = document.getElementById('metadata');

  // Wire up event handlers to deal with login and logout.
  loginBtn.onclick = () => {
    // Sign-in via the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/advanced/q/platform/js/#identity-pool-federation
    Auth.federatedSignIn();
  };
  logoutBtn.onclick = () => {
    // Sign-out of the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js/#sign-out
    Auth.signOut();
  };

  // See if we're signed in (i.e., we'll have a `user` object)
  const user = await getUser();
  
  if (!user) {
    // Disable the Logout button
    logoutBtn.disabled = true;
    return;
  }

  // Log the user info for debugging purposes
  console.log({ user });
  
  createBtn.onclick = async () => {
    console.log('Create fragment button clicked');
    var input = document.getElementById('fragment').value; //text
    var input2 = document.getElementById('fragmentimage'); //file
    console.log(selectedType.value);

    if(selectedType.value.startsWith('image/'))
    {
      await postUserFragments(user, input2.files[0], selectedType.value);
    } 
    else
    {
      await postUserFragments(user, JSON.stringify(input), selectedType.value);
    }
  };

  modifyBtn.onclick = async () => {
    console.log('Modify fragment button clicked');
    var input = document.getElementById('modifiedFragment').value; //get fragment data
    var imageinput = document.getElementById('fragmentimage2'); //get image fragment data
    var inputID = document.getElementById('modifyID').value; //get id value
    console.log(selectedType2.value);

    if(selectedType2.value.startsWith('image/')){
      await modifyFragmentById(user, inputID, imageinput.files[0], selectedType2.value); //image file
    } else{
      await modifyFragmentById(user, inputID, JSON.stringify(input), selectedType2.value); //text
    }

    
  };

  getByIdBtn.onclick = async () => {
    var input = document.getElementById('getID').value;
    console.log(input);
    const getFragment  = await getFragmentById(user, input);
    if(getFragment.type.startsWith('image/')){
      fragdisp.style.display = 'block';
      imagePlace.innerHTML = `<img src="data:${getFragment.type};base64,${getFragment.data}" />`
    } else{
      fragdisp.style.display = 'block';
      imagePlace.innerHTML = `<pre>${getFragment.data}</pre>`
    }
    const metadata = await getFragmentById(user, input);
      if (metadata) {
        metadataSection.style.display = 'block';
        metadataToDisplay.innerHTML = JSON.stringify(metadata);
      }
  };

  deleteBtn.onclick = async () => {
    var input = document.getElementById('deleteID').value;
    console.log(input);
    deleteFragmentById(user, input);
  };

  // Update the UI to welcome the user
  userSection.hidden = false;

  // Show the user's username
  userSection.querySelector('.username').innerText = user.username;

  // Disable the Login button
  loginBtn.disabled = true;

  // Do an authenticated request to the fragments API server and log the result
  getUserFragments(user);
}

// Wait for the DOM to be ready, then start the app
addEventListener('DOMContentLoaded', init);