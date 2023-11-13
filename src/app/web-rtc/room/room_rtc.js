"use client";

import { v4 as uuidv4 } from "uuid";
import AgoraRTC from "agora-rtc-sdk-ng";

export default function RoomRTC() {
  const API_ID = "88400195580549988f846a16e954de64";

  // let uid = window.sessionStorage.getItem("uid");
  // if (!uid) {
  //   uid = uuidv4();
  //   window.sessionStorage.setItem("uid", uid);
  // }

  let token = null;
  let localStracks = [];
  let remoteUsers = [];
  let client;
  let uid = window.localStorage?.getItem("x-client-id");
  console.log(window.location.href);
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  let roomId = urlParams.get("room");
  if (!roomId) {
    roomId = "main";
  }

  const JoinRoominit = async () => {
    client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    await client.join(API_ID, roomId, token, uid);
    await joinStream();
  };

  let joinStream = async () => {
    localStracks = await AgoraRTC.createMicrophoneAndCameraTracks();
    let player = `<div className="video_container" id="user-container-${uid}">
                    <div className="video-player" id="user-${uid}">${uid}</div>
                  </div>`;
    document
      .getElementById("streams_container")
      .insertAdjacentHTML("beforeend", player);

    localStracks[1].play(`user-${uid}`);
  };

  JoinRoominit();
}
