"use client";

import "../../web-rtc/main.css";
import "../room/room.css";
import { v4 as uuidv4 } from "uuid";
import AgoraRTC from "agora-rtc-sdk-ng";
import AgoraRTM from "agora-rtm-sdk";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RoomRTC() {
  const [client, setClient] = useState(null);
  const [clientMess, setClientMess] = useState(null);
  const [channel, setChannel] = useState(null);
  const [localTracks, setLocalTracks] = useState({
    videoTrack: null,
    audioTrack: null,
  });
  const router = useRouter();
  // const channelId = uuidv4();
  const urlParams = new URLSearchParams(window.location.search);
  let channelId = urlParams.get("room");
  if (!channelId) {
    channelId = "main";
  }

  let displayName = sessionStorage.getItem("display_name");
  if (!displayName) {
    router.push("/web-rtc/lobby");
  }

  const appId = "88400195580549988f846a16e954de64";

  let uid = window.sessionStorage.getItem("uid");
  if (!uid) {
    uid = uuidv4();
    window.sessionStorage.setItem("uid", uid);
  }

  let token = null;
  let remoteUsers = [];
  let localScreenTrack;
  let sharingScreen = false;
  // let channel;
  useEffect(() => {
    if (!client) {
      const rtcClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      setClient(rtcClient);

      const rtmClient = AgoraRTM.createInstance(appId);
      setClientMess(rtmClient);
    } else {
      joinChannel();
      client.on("user-published", handleUserPublished);
      client.on("user-left", handleUserLeft);
    }
  }, [client]);

  const joinChannel = async () => {
    await clientMess.login({ uid, token });

    await clientMess.addOrUpdateLocalUserAttributes({ name: displayName });

    const channelInstance = await clientMess.createChannel(channelId);
    await channelInstance.join();
    setChannel(channelInstance);

    const handleChannelMessage = async (messageData, memberId) => {
      let data = JSON.parse(messageData.text);
      if (data.type === "chat") {
        addMessageToDom(data.displayName, data.message);
      }
    };

    const handleMemberJoined = async (memberId) => {
      addMemberToDom(memberId);
      let members = await channelInstance.getMembers();
      updatememberTotal(members);
    };

    const handleMemberLeft = async (memberId) => {
      removeMemberFormDom(memberId);
      let members = await channelInstance.getMembers();
      updatememberTotal(members);
    };

    let getMembers = async () => {
      let members = await channelInstance.getMembers();
      updatememberTotal(members);
      for (let i = 0; members.length > i; i++) {
        addMemberToDom(members[i]);
      }
    };

    getMembers();

    channelInstance.on("MemberJoined", handleMemberJoined);
    channelInstance.on("MemberLeft", handleMemberLeft);
    channelInstance.on("ChannelMessage", handleChannelMessage);

    await client.join(appId, channelId, token, uid);
    const [audioTrack, videoTrack] =
      await AgoraRTC.createMicrophoneAndCameraTracks(
        {},
        {
          encoderConfig: {
            width: { min: 640, max: 1920, ideal: 1920 },
            height: { min: 480, max: 1080, ideal: 1080 },
          },
        }
      );
    await client.publish([audioTrack, videoTrack]);
    client.on("user-published", handleUserPublished);
    client.on("user-left", handleUserLeft);
    setLocalTracks({ audioTrack, videoTrack });
  };

  useEffect(() => {
    if (localTracks.audioTrack && localTracks.videoTrack) {
      let player = document.createElement("div");
      player.className = "video_container";
      player.id = `user-container-${uid}`;

      let videoPlayer = document.createElement("div");
      videoPlayer.className = "video-player";
      videoPlayer.id = `user-${uid}`;

      player.appendChild(videoPlayer);

      document.getElementById("streams_container").appendChild(player);
      document
        .getElementById(`user-container-${uid}`)
        .addEventListener("click", expandVideoFrame);
      document
        .getElementById("camera-btn")
        .addEventListener("click", toggleCamera);
      document.getElementById("mic-btn").addEventListener("click", toggleMic);
      document
        .getElementById("srceen-btn")
        .addEventListener("click", toggleScreenShare);

      document
        .getElementById("leave-btn")
        .addEventListener("click", leaveChannel);

      let messageForm = document.getElementById("message__form");
      messageForm.addEventListener("submit", sendMessage);

      window.addEventListener("beforeunload", leaveChannel);

      localTracks.videoTrack.play(`user-${uid}`);
    }
  }, [localTracks, uid, client]);

  let handleUserPublished = async (user, mediaType) => {
    remoteUsers[user.uid] = user;
    await client.subscribe(user, mediaType);

    let player = document.getElementById(`user-container-${user.uid}`);
    if (player === null) {
      player = document.createElement("div");
      player.className = "video_container";
      player.id = `user-container-${user.uid}`;

      let videoPlayer = document.createElement("div");
      videoPlayer.className = "video-player";
      videoPlayer.id = `user-${user.uid}`;

      player.appendChild(videoPlayer);

      document.getElementById("streams_container").appendChild(player);
      document
        .getElementById(`user-container-${user.uid}`)
        .addEventListener("click", expandVideoFrame);
    }

    if (displayFrame.style.display) {
      let videoFrame = document.getElementById(`user-container-${user.uid}`);
      videoFrame.style.height = "100px";
      videoFrame.style.width = "100px";
    }

    if (mediaType === "video") {
      user.videoTrack.play(`user-${user.uid}`);
    }

    if (mediaType === "audio") {
      user.audioTrack.play();
    }
  };

  let handleUserLeft = async (user) => {
    delete remoteUsers[user.uid];
    let item = document.getElementById(`user-container-${user.uid}`);
    if (item) {
      item.remove();
    }
    if (userIdnDisplayFrame === `user-container-${user.uid}`) {
      displayFrame.style.display = null;

      let videoFrames = document.getElementsByClassName("video_container");

      for (let i = 0; videoFrames.length > i; i++) {
        videoFrames[i].style.height = "300px";
        videoFrames[i].style.width = "300px";
      }
    }
  };

  ///
  let displayFrame = document.getElementById("stream_box");
  let videoFrames = document.getElementsByClassName("video_container");
  let userIdnDisplayFrame = null;

  let expandVideoFrame = (e) => {
    let child = displayFrame.children[0];
    if (child) {
      document.getElementById("streams_container").appendChild(child);
    }
    displayFrame.style.display = "block";
    displayFrame.appendChild(e.currentTarget);
    userIdnDisplayFrame = e.currentTarget.id;

    for (let i = 0; videoFrames.length > i; i++) {
      if (videoFrames[i].id !== userIdnDisplayFrame) {
        videoFrames[i].style.height = "100px";
        videoFrames[i].style.width = "100px";
      }
    }
  };

  for (let i = 0; videoFrames.length > i; i++) {
    videoFrames[i].addEventListener("click", expandVideoFrame);
  }

  let hideDisplayFrame = () => {
    userIdnDisplayFrame = null;
    displayFrame.style.display = null;

    let child = displayFrame.children[0];
    document.getElementById("streams_container").appendChild(child);

    for (let i = 0; videoFrames.length > i; i++) {
      videoFrames[i].style.height = "300px";
      videoFrames[i].style.width = "300px";
    }
  };

  let toggleCamera = async (e) => {
    let button = e.currentTarget;
    if (localTracks.videoTrack) {
      let isMuted = localTracks.videoTrack.muted;
      if (isMuted) {
        await localTracks.videoTrack.setMuted(false);
        button.classList.add("active");
      } else {
        await localTracks.videoTrack.setMuted(true);
        button.classList.remove("active");
      }
    }
  };

  let toggleMic = async (e) => {
    let button = e.currentTarget;
    if (localTracks.audioTrack) {
      let isMuted = localTracks.audioTrack.muted;
      if (isMuted) {
        await localTracks.audioTrack.setMuted(false);
        button.classList.add("active");
      } else {
        await localTracks.audioTrack.setMuted(true);
        button.classList.remove("active");
      }
    }
  };

  let switchToCamera = async () => {
    let player = document.createElement("div");
    player.className = "video_container";
    player.id = `user-container-${uid}`;

    let videoPlayer = document.createElement("div");
    videoPlayer.className = "video-player";
    videoPlayer.id = `user-${uid}`;

    player.appendChild(videoPlayer);
    displayFrame.appendChild(player);

    await localTracks.videoTrack.setMuted(true);
    await localTracks.audioTrack.setMuted(true);

    document.getElementById("mic-btn").classList.remove("active");
    document.getElementById("srceen-btn").classList.remove("active");

    if (localTracks) {
      localTracks.videoTrack.play(`user-${uid}`);
      localTracks.audioTrack.play(`user-${uid}`);
      await client.publish([localTracks.videoTrack, localTracks.audioTrack]);
    }
  };

  let toggleScreenShare = async (e) => {
    let screenButton = e.currentTarget;
    let cameraBtn = document.getElementById("camera-btn");
    if (!sharingScreen) {
      sharingScreen = true;
      screenButton.classList.add("active");
      cameraBtn.classList.remove("active");
      cameraBtn.style.display = "none";
      localScreenTrack = await AgoraRTC.createScreenVideoTrack();
      document.getElementById(`user-container-${uid}`).remove();
      displayFrame.style.display = "block";

      let player = document.createElement("div");
      player.className = "video_container";
      player.id = `user-container-${uid}`;

      let videoPlayer = document.createElement("div");
      videoPlayer.className = "video-player";
      videoPlayer.id = `user-${uid}`;

      player.appendChild(videoPlayer);

      document.getElementById("streams_container").appendChild(player);
      document
        .getElementById(`user-container-${uid}`)
        .addEventListener("click", expandVideoFrame);

      userIdnDisplayFrame = `user-container-${uid}`;
      localScreenTrack.play(`user-${uid}`);

      if (localTracks.videoTrack) {
        await client.unpublish(localTracks.videoTrack);
      }
      await client.publish(localScreenTrack);

      let videoFrames = document.getElementsByClassName("video__container");
      for (let i = 0; videoFrames.length > i; i++) {
        if (videoFrames[i].id != userIdInDisplayFrame) {
          videoFrames[i].style.height = "100px";
          videoFrames[i].style.width = "100px";
        }
      }
    } else {
      sharingScreen = false;
      cameraBtn.style.display = "block";
      document.getElementById(`user-container-${uid}`).remove();
      if (localScreenTrack) {
        await client.unpublish(localScreenTrack);
        localScreenTrack.stop();
        localScreenTrack.close();
        localScreenTrack = null;
      }
      await switchToCamera();
    }
  };

  ///rtm member joined

  let removeMemberFormDom = async (memberId) => {
    let memberWrapper = document.getElementById(`member__${memberId}__wrapper`);
    if (memberWrapper) {
      memberWrapper.remove();
    }
  };

  let leaveChannel = async () => {
    await client.leave();
    await clientMess.logout();
    router.push("/");
  };

  let addMemberToDom = async (memberId) => {
    let { name } = await clientMess.getUserAttributesByKeys(memberId, ["name"]);
    let member = document.createElement("div");
    member.className = "member__wrapper";
    member.id = `member__${memberId}__wrapper`;

    let memberIcon = document.createElement("span");
    memberIcon.className = "green__icon";

    let memberName = document.createElement("p");
    memberName.className = "member_name";
    memberName.innerHTML = name;

    member.appendChild(memberIcon);
    member.appendChild(memberName);

    document.getElementById("member__list").appendChild(member);
  };

  let updatememberTotal = async (members) => {
    let total = document.getElementById("members__count");
    total.innerHTML = members.length;
  };

  //send message

  let sendMessage = async (e) => {
    e.preventDefault();

    let message = e.target.message.value;
    if (channel) {
      channel.sendMessage({
        text: JSON.stringify({
          type: "chat",
          message: message,
          displayName: displayName,
        }),
      });
      addMessageToDom(displayName, message);
    } else {
      console.error("Channel is not defined yet.");
    }
    e.target.reset();
  };

  let addMessageToDom = (name, message) => {
    let messagesWrapper = document.getElementById("messages");

    let newMessage = document.createElement("div");
    newMessage.className = "message__wrapper";

    let messageBody = document.createElement("div");
    messageBody.className = "message__body";

    let author = document.createElement("strong");
    author.className = "message__author";
    author.textContent = name;

    let text = document.createElement("p");
    text.className = "message__text";
    text.textContent = message;

    messageBody.appendChild(author);
    messageBody.appendChild(text);

    newMessage.appendChild(messageBody);

    messagesWrapper.appendChild(newMessage);

    let lastMessage = document.querySelector(
      "#messages .message__wrapper:last-child"
    );
    if (lastMessage) {
      lastMessage.scrollIntoView();
    }
  };

  return (
    <div id="room__container">
      <section id="members__container">
        <div id="members__header">
          <p>Participants</p>
          <strong id="members__count">0</strong>
        </div>

        <div id="member__list">
          {/* <div className="member__wrapper" id="member__1__wrapper">
              <span className="green__icon"></span>
              <p className="member_name">Sulammita</p>
            </div> */}
        </div>
      </section>

      <section id="stream__container">
        <div id="stream_box"></div>

        <div id="streams_container"></div>
        <div className="stream__actions">
          <button id="camera-btn" class="active">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M5 4h-3v-1h3v1zm10.93 0l.812 1.219c.743 1.115 1.987 1.781 3.328 1.781h1.93v13h-20v-13h3.93c1.341 0 2.585-.666 3.328-1.781l.812-1.219h5.86zm1.07-2h-8l-1.406 2.109c-.371.557-.995.891-1.664.891h-5.93v17h24v-17h-3.93c-.669 0-1.293-.334-1.664-.891l-1.406-2.109zm-11 8c0-.552-.447-1-1-1s-1 .448-1 1 .447 1 1 1 1-.448 1-1zm7 0c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3zm0-2c-2.761 0-5 2.239-5 5s2.239 5 5 5 5-2.239 5-5-2.239-5-5-5z" />
            </svg>
          </button>
          <button id="mic-btn" className="active">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M12 2c1.103 0 2 .897 2 2v7c0 1.103-.897 2-2 2s-2-.897-2-2v-7c0-1.103.897-2 2-2zm0-2c-2.209 0-4 1.791-4 4v7c0 2.209 1.791 4 4 4s4-1.791 4-4v-7c0-2.209-1.791-4-4-4zm8 9v2c0 4.418-3.582 8-8 8s-8-3.582-8-8v-2h2v2c0 3.309 2.691 6 6 6s6-2.691 6-6v-2h2zm-7 13v-2h-2v2h-4v2h10v-2h-4z" />
            </svg>
          </button>
          <button id="srceen-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M0 1v17h24v-17h-24zm22 15h-20v-13h20v13zm-6.599 4l2.599 3h-12l2.599-3h6.802z" />
            </svg>
          </button>
          <button id="leave-btn" className="active">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M16 10v-5l8 7-8 7v-5h-8v-4h8zm-16-8v20h14v-2h-12v-16h12v-2h-14z" />
            </svg>
          </button>
        </div>
      </section>

      <section id="messages__container">
        <div id="messages"></div>

        <form id="message__form">
          <input type="text" name="message" placeholder="Send a message...." />
        </form>
      </section>
    </div>
  );
}
