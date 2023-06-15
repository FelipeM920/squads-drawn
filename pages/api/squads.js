import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("sorteadorDB");
  switch (req.method) {
    case "GET":
      const allSquads = await db.collection("squad").find({}).toArray();
      res.json({ status: 200, data: allSquads });
      break;
    case "POST":
      const { name } = JSON.parse(req.body);
      const myPost = await db.collection("squad").insertOne({ name: name });
      const postResult = await db.collection("squad").find({}).toArray();
      res.json(postResult);
      break;
    case "DELETE":
      const { squadId } = JSON.parse(req.body);
      let myDelete = await db.collection("squad").deleteOne({
        id: squadId,
      });
      const deleteResults = await db.collection("squad").find({}).toArray();
      res.json({ status: 200, data: deleteResults });
      break;
  }
}