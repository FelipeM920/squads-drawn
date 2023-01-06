import styles from '../styles/Home.module.css'

export async function getServerSideProps() {
  console.log('process.env.API_URL', process.env.API_URL)
  let res = await fetch(`${process.env.API_URL}/api/posts`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let allPosts = await res.json();
  console.log('allPosts', allPosts)
  return {
    props: { allPosts },
  };
}

export default function Home() {
  return (
    <><div>Teste</div></>
  )
}
