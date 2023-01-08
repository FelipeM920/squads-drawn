import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("sorteadorDB");
  const options = { upsert: true, returnDocument: 'after' };
  switch (req.method) {
    case "POST":
      let bodyObject = JSON.parse(req.body);
      let myPost = await db.collection("users").insertOne(bodyObject);
      let postResult = await db.collection("users").find({}).toArray();
      res.json(postResult);
      break;
    case "GET":
      const allPosts = await db.collection("users").find({}).toArray();
      res.json({ status: 200, data: allPosts });
      break;
    case "PUT":
      const { id, checkStatus, name, timesDrawn } = JSON.parse(req.body);
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
      let allUsersAfterUpdate = await db.collection("users").find({}).toArray();
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

// export async function getServerSideProps() {
//   let res = await fetch(`${process.env.API_URL}/api/users`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
//   let allUsers = await res.json();
//   return {
//     props: { allUsers },
//   };
// }

// useEffect(() => {
//   setPostsState(allPosts);
// }, [allPosts]);

// let submitForm = async (e) => {
//   setLoading(true);
//   e.preventDefault();
//   let res = await fetch("http://localhost:3000/api/posts", {
//     method: "POST",
//     body: JSON.stringify({
//       title: title,
//       content: content,
//     }),
//   });
//   res = await res.json();
//   setPostsState([...postsState, res]);
//   setTitle("");
//   setContent("");
//   setLoading(false);
// };