// src/api.js

// fragments microservice API, defaults to localhost:8080
const apiUrl = process.env.API_URL || 'http://localhost:8080';

/**
 * Given an authenticated user, request all fragments for this user from the
 * fragments microservice (currently only running locally). We expect a user
 * to have an `idToken` attached, so we can send that along with the request.
 */
export async function getUserFragments(user) {
  console.log('Requesting user fragments data...');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments?expand=1`, {
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders(),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Got user fragments data', { data });
  } catch (err) {
    console.error('Unable to call GET /v1/fragment', { err });
  }
}

//user can create a fragment
export async function postUserFragments(user, fragment, fragmentType) {
  console.log('Posting user fragment data...');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      method: "POST",
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders(fragmentType),
      body: fragment,
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Got user fragments data from user input', { data });
  } catch (err) {
    console.error('Unable to call POST /v1/fragment', { err });
  }
}

//user can get a fragment by id
export async function getFragmentById(user, id) {
  console.log('Requesting user fragment data...');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders(),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const type = res.headers.get('Content-Type');
    let data; 
    console.log('Converted to-->' + 'image/png');
    if(type.startsWith('image/')){ data = await res.text(); }
    else{ data = await res.json(); }
    const result = {type: type , data: data};
    return result;
  } catch (err) {
    console.error('Unable to call GET /v1/fragment/${id}', { err });
  }
}

//user can modify a fragment
export async function modifyFragmentById(user, id, fragment, fragmentType) {
  console.log('Modifying user fragment data...');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
      method: "put",
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders(fragmentType),
      body: fragment,
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Updated user fragment', { data });
  } catch (err) {
    console.error('Unable to call PUT /v1/fragment/${id}', { err });
  }
}

//user can delete a fragment
export async function deleteFragmentById(user, id) {
  console.log('Deleting user fragment data...');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
      method: "delete",
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders(),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Deleted fragment', { data });
  } catch (err) {
    console.error('Unable to call DELETE /v1/fragment/${id}', { err });
  }
}