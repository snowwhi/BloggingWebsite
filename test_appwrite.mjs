import { Client, Databases } from "appwrite";

const client = new Client()
    .setEndpoint("https://sgp.cloud.appwrite.io/v1")
    .setProject("69a51fbb0034df707ff4");

const databases = new Databases(client);

async function check() {
    try {
        const response = await databases.listDocuments(
            "69a522f8000eb182884f",
            "article"
        );
        console.log("Documents found:", response.documents.length);
        if (response.documents.length > 0) {
            response.documents.forEach(doc => {
                console.log(`Title: ${doc.Title}, featuredimage: '${doc.featuredimage}'`);
            });
        }
    } catch (e) {
        console.error("Error:", e);
    }
}

check();
