import{ db, auth} from "../modules/init.js";

document.addEventListener("DOMContentLoaded", async function() {
    const main = document.getElementById("main");
    const usersList = document.getElementById("usersList");

    main.innerHTML += "My current users:";

    try {
        const usersCollection = collection(db, "users");

        const querySnapshot = await getDocs(usersCollection);

        if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
                const listItem = document.createElement("li");
                listItem.textContent = `${doc.data().name} ${doc.data().surname}`;
                usersList.appendChild(listItem);
            });
        } else {
            usersList.innerHTML = "<li>No users found</li>";
        }
    } catch (error) {
        console.error("Error fetching documents: ", error);
        usersList.innerHTML = "<li>Error fetching users</li>";
    }
});
