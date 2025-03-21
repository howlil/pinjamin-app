import Pusher from "pusher";

const pusher = new Pusher({
  appId: "1957601",
  key: "862d5f8def70ea57a72d",
  secret: "642687db486451c8bb28",
  cluster: "ap1",
  useTLS: true,
});

export default pusher

