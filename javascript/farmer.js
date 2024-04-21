
function logout() {
    firebase.auth().signOut().then(() => {
        
        window.location.reload(); 
    }).catch((error) => {
        
        console.error("Error logging out:", error);
    });
}

// for adding the new listings (crop)
function addListing() {
    const crop = document.getElementById("crop").value;
    const price = parseFloat(document.getElementById("price").value);
    const quantity = parseFloat(document.getElementById("quantity").value);

    if (!crop || isNaN(price) || isNaN(quantity)) {
        alert("Please fill in all fields with valid data.");
        return;
    }

    db.collection("listings").add({
        crop: crop,
        pricePerKg: price,
        availableQuantity: quantity,
        farmerId: firebase.auth().currentUser.uid
    })
    .then(() => {
        console.log("Listing added successfully.");
        
        document.getElementById("crop").value = "";
        document.getElementById("price").value = "";
        document.getElementById("quantity").value = "";
    })
    .catch((error) => {
        console.error("Error adding listing:", error);
    });
}


function showDashboard() {
    document.getElementById("login-container").style.display = "none";
    document.getElementById("signup-container").style.display = "none";
    document.getElementById("dashboard").style.display = "block";

    
    db.collection("listings").onSnapshot((querySnapshot) => {
        const listings = document.getElementById("listings");
        listings.innerHTML = ""; 
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const li = document.createElement("li");
            li.textContent = `${data.crop} - $${data.pricePerKg.toFixed(2)} per kg (${data.availableQuantity} kg available)`;
            listings.appendChild(li);
        });
    });

    // order recieved will be loaded using below function
    db.collection("orders").where("farmerId", "==", firebase.auth().currentUser.uid)
        .onSnapshot((querySnapshot) => {
            const orders = document.getElementById("orders");
            orders.innerHTML = ""; 
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const li = document.createElement("li");
                li.textContent = `Order ID: ${doc.id}, Crop: ${data.crop}, Quantity: ${data.quantity} kg`;
                orders.appendChild(li);
            });
        });
}


firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        showDashboard();
    }
});
