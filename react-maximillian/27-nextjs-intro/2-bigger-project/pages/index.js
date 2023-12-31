import Head from 'next/head';
import MeetupList from '../components/meetups/MeetupList';
import { MongoClient } from 'mongodb';

// const DUMMY_MEETUPS = [
//   {
//     id: 'm1',
//     title: 'A First Meetup',
//     image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/1280px-Stadtbild_M%C3%BCnchen.jpg',
//     address: 'Some address 5, 12345 Some City',
//     description: 'This is a first meetup!'
//   },
//   {
//     id: 'm2',
//     title: 'A Second Meetup',
//     image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/1280px-Stadtbild_M%C3%BCnchen.jpg',
//     address: 'Some address 10, 12345 Some City',
//     description: 'This is a second meetup!'
//   }
// ];

export default function HomePage(props) { // -> this is the props set in getStaticProps()
  return <>
    <Head>
      <title>React Meetups</title>
      <meta name='description' content='Browse a huge list of highly active React meetups!' />
    </Head>
    <MeetupList meetups={props.meetups} />
  </>
}



///////////////////////////////////////
// Server Side Rendering
///////////////////////////////////////
/*
export async function getServerSideProps(context) {
  const req = context.req;
  const res = context.res;


  // fetch data from an API or file system
  return {
    props: { meetups: DUMMY_MEETUPS },
  };

}// runs always on the server, after deployment. Any code written in that function will run only on the server, NEVER on the CLIENT!!!!
*/


///////////////////////////////////////
// Static Site Generation
////////////////////////////////

export async function getStaticProps() {
  // fetch data from API or database
  // read files from file system

  const client = await MongoClient.connect('mongodb+srv://nikog:3JHfHiG8lCEvOVpr@cluster0.l8voow3.mongodb.net/meetups?retryWrites=true&w=majority');
  const db = client.db();
  const meetupsCollection = db.collection('meetups');

  const meetups = await meetupsCollection.find().toArray();

  client.close();

  console.log(meetups);

  return {
    props: {
      meetups: meetups.map(meetup => ({
        title: meetup.title,
        image: meetup.image,
        address: meetup.address,
        id: meetup._id.toString(),
      }))
    },
    revalidate: 1
  }; //always return an object

} // reserved name for this function. And it is available only in pages's components Next JS searches for that function and if it finds it, executes it during the pre-rendering process. In this function you can execute any code that would normally only run on a server! You could access a file system here or securely connect to a database, because any code you write here will never run on the client side and will never execute on the client side!!!! This code is executed during the build process!! N.B.

