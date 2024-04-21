// can be used from .env file but for simplicity used directly
const firebaseConfig = {
    
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  const auth = firebase.auth();
  const db = firebase.firestore();
  
  // Function to show registration form
  function showRegisterForm() {
      document.getElementById('loginForm').style.display = 'none';
      document.getElementById('loginOut').style.height = '0';
      document.getElementById('registerForm').style.display = 'block';
      if ('geolocation' in navigator) {
        navigator.permissions.query({ name: 'geolocation' }).then(permissionStatus => {
            if (permissionStatus.state === 'granted') {
                fetchAndSetLocation();
            } else if (permissionStatus.state === 'prompt') {
                // Show browser's built-in permission dialog
                navigator.geolocation.getCurrentPosition(
                    position => {
                        fetchAndSetLocation();
                    },
                    error => {
                        console.error('Error fetching location:', error);
                        // Handle error (optional)
                    }
                );
            }
        });
    } else {
        console.error('Geolocation is not supported by this browser.');
        // Handle unsupported browser (optional)
    }
}

function fetchAndSetLocation() {
    navigator.geolocation.getCurrentPosition(position => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        // Set the fetched location to the input field
        document.getElementById('location').value = `${latitude}, ${longitude}`;
    }, error => {
        console.error('Error fetching location:', error);
        // Handle error (optional)
    });

  }
  
  // Function to show login form
  function showLoginForm() {
      document.getElementById('registerForm').style.display = 'none';
       document.getElementById('loginForm').style.display = 'flex';
       document.getElementById('loginOut').style.height = '100vh';
  }
  
  // Function to register a new worker
 // Function to register a new worker
function register() {
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const name = document.getElementById('name').value;
    const Contact = document.getElementById('userContact').value; // Change variable name to 'contact'
    const location = document.getElementById('location').value;
    const workHistory = parseInt(document.getElementById('workHistory').value);
    const dailyRate = parseInt(document.getElementById('dailyRate').value);
    const skills = document.getElementById('skills').value.split(',');

    // Check if any field is empty
    if (!email || !password || !name || !Contact || !location || !workHistory || !dailyRate || !skills) {
        alert("Please fill in all sections.");
        return; // Stop registration if any field is empty
    }

    // Check contact length
    if (Contact.length !== 10) {
        alert("Please enter a 10-digit contact number.");
        return; // Stop registration if contact is not 10 characters long
    }

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            db.collection('workers').doc(user.uid).set({
                name: name,
                email: email,
                Contact: Contact, // Change variable name to 'contact'
                location: location,
                workHistory: workHistory,
                dailyRate: dailyRate,
                skills: skills,
                availability: true,
                ratings: []
            })
            .then(() => {
                console.log("Worker registered successfully");
                showDashboard(user);
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
        })
        .catch((error) => {
            console.error("Error registering user: ", error);
        });
}

  
  // Function to log in
  function login() {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      auth.signInWithEmailAndPassword(email, password)
          .then((userCredential) => {
              const user = userCredential.user;
              showDashboard(user);
          })
          .catch((error) => {
              console.error("Error logging in: ", error);
          });
  }
  
  // Function to show worker dashboard
  function showDashboard(user) {
    db.collection('workers').doc(user.uid).get()
        .then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                document.getElementById('userName').textContent = data.name;
                document.getElementById('userEmail').textContent = user.email;
                document.getElementById('userContact').textContent = data.Contact;
                document.getElementById('userLocation').textContent = data.location;
                document.getElementById('userWorkHistory').textContent = data.workHistory;
                document.getElementById('userDailyRate').textContent = data.dailyRate;
                document.getElementById('userSkills').textContent = data.skills.join(', ');
                document.getElementById('userAvailability').textContent = data.availability ? 'Available' : 'Not Available'; // Display availability status
                document.getElementById('loginForm').style.display = 'none';
                document.getElementById('registerForm').style.display = 'none';
                document.getElementById('loginOut').style.height = '0';
                document.getElementById('registerForm').style.height = '0';
                document.getElementById('dashboard').style.display = 'block';
            } else {
                console.error("No such document");
            }
        })
        .catch((error) => {
            console.error("Error getting document: ", error);
        });
}
  
  function updateProfile() {
    const user = firebase.auth().currentUser;
    if (user) {
        const name = document.getElementById('userName').textContent;
        const Contact = document.getElementById('userContact').textContent;
        const location = document.getElementById('userLocation').textContent;
        const workHistory = parseInt(document.getElementById('userWorkHistory').textContent);
        const dailyRate = parseInt(document.getElementById('userDailyRate').textContent);
        const skills = document.getElementById('userSkills').textContent.split(',');
        db.collection('workers').doc(user.uid).update({
            name: name,
            Contact: Contact,
            location: location,
            workHistory: workHistory,
            dailyRate: dailyRate,
            skills: skills
        })
            .then(() => {
                console.log("Profile updated successfully");
            })
            .catch((error) => {
                console.error("Error updating profile: ", error);
            });
    } else {
        console.error("User not logged in");
    }
}
  // Function to toggle availability
 
function toggleAvailability() {
    const user = firebase.auth().currentUser;
    if (user) {
        db.collection('workers').doc(user.uid).get()
            .then((doc) => {
                if (doc.exists) {
                    const data = doc.data();
                    const updatedAvailability = !data.availability;
                    db.collection('workers').doc(user.uid).update({ availability: updatedAvailability })
                        .then(() => {
                            console.log("Availability updated successfully");
                          
                            document.getElementById('userAvailability').textContent = updatedAvailability ? 'Available' : 'Not Available';
                        })
                        .catch((error) => {
                            console.error("Error updating availability: ", error);
                        });
                } else {
                    console.error("No such document");
                }
            })
            .catch((error) => {
                console.error("Error getting document: ", error);
            });
    } else {
        console.error("User not logged in");
    }
}


// Function to fetch and display reviews
function fetchReviews() {
    const user = firebase.auth().currentUser;
    if (user) {
        db.collection('workers').doc(user.uid).get()
            .then((doc) => {
                if (doc.exists) {
                    const data = doc.data();
                    const ratings = data.ratings;
                    // Display ratings in the UI
                    // You can loop through ratings and display them however you want
                    console.log("Ratings: ", ratings);
                } else {
                    console.error("No such document");
                }
            })
            .catch((error) => {
                console.error("Error getting document: ", error);
            });
    } else {
        console.error("User not logged in");
    }
}
  // app.js

// Function to edit profile
function editProfile() {
    const nameInput = prompt("Enter your new name:", document.getElementById('userName').textContent);
    const ContactInput = prompt("Enter your new Contact Info:", document.getElementById('userContact').textContent);
    const workHistoryInput = prompt("Enter your new work history (years):", document.getElementById('userWorkHistory').textContent);
    const dailyRateInput = prompt("Enter your new daily rate (Rupees):", document.getElementById('userDailyRate').textContent);
    const skillsInput = prompt("Enter your new skills (comma separated):", document.getElementById('userSkills').textContent);
    
    const user = firebase.auth().currentUser;
    if (user) {
        db.collection('workers').doc(user.uid).update({
            name: nameInput,
            Contact: parseInt(ContactInput),
            workHistory: parseInt(workHistoryInput),
            dailyRate: parseInt(dailyRateInput),
            skills: skillsInput.split(',')
        })
        .then(() => {
            console.log("Profile updated successfully");
            // Update profile in the UI
            document.getElementById('userName').textContent = nameInput;
            document.getElementById('userContact').textContent = ContactInput;
            document.getElementById('userWorkHistory').textContent = workHistoryInput;
            document.getElementById('userDailyRate').textContent = dailyRateInput;
            document.getElementById('userSkills').textContent = skillsInput;
        })
        .catch((error) => {
            console.error("Error updating profile: ", error);
        });
    } else {
        console.error("User not logged in");
    }
}
// app.js

// Function to log out
function logout() {
    firebase.auth().signOut().then(() => {
        console.log('User logged out successfully');
        // Hide the dashboard and show the login form
        document.getElementById('dashboard').style.display = 'none';
        document.getElementById('loginForm').style.display = 'flex';
        document.getElementById('loginOut').style.height = '100vh';
    }).catch((error) => {
        console.error('Error logging out:', error);
    });
}
