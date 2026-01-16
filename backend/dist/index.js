import dbConnect from "./config/db.js";
import { User } from "./models/db.js";
await dbConnect();
try {
    const res = await User.create({
        "username": "Bhumesh",
        "email": "Bhumeshmahajan01@gmail.com",
        "password": "1234@BHu",
        "firstName": "BHumesh ",
        "lastName": "Mahajan "
    });
    console.log(res);
}
catch (err) {
    console.log("ERROR CREATING USER", err);
}
//# sourceMappingURL=index.js.map