import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("sorteadorDB");
  switch (req.method) {
    case "POST":
      let bodyObject = JSON.parse(req.body);
      let myPost = await db.collection("users").insertOne(bodyObject);
      let postResult = await db.collection("users").find({ squad: bodyObject.squad }).toArray();
      res.json(postResult);
      break;
    case "GET":
      const { idSquad } = req.query;
      const allPosts = await db.collection("users").find({ squad: Number(idSquad) }).toArray();
      res.json({ status: 200, data: allPosts });
      break;
    case "PUT":
      const { id, checkStatus, name, timesDrawn, squad } = JSON.parse(req.body);
      let myPut = await db.collection("users").updateOne(
        {
          userId: id
        },
        {
          $set: {
            checked_for_draw: checkStatus,
            name: name,
            times_drawn: timesDrawn
          },
        }
      );
      let allUsersAfterUpdate = await db.collection("users").find({ squad: squad }).toArray();
      res.json({ status: 200, data: allUsersAfterUpdate });
      break;
    case "DELETE":
      const { userId } = JSON.parse(req.body);
      let myDelete = await db.collection("users").deleteOne({
        userId: userId,
      });
      let allUsers = await db.collection("users").find({}).toArray();
      res.json({ status: 200, data: allUsers });
      break;
  }
}