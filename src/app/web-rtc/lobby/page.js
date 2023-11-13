"use client";
import React, { useState } from "react";
import "../lobby/lobby.css";
import { useRouter } from "next/navigation";

export default function Lobby() {
  const [userName, setUserName] = useState("");
  const [roomName, setRoomName] = useState("");
  const router = useRouter();

  let displayName = window.sessionStorage.getItem("display_name");
  if (displayName) {
    setUserName(displayName);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    window.sessionStorage.setItem("display_name", userName);

    let inviteCode = roomName;
    if (!inviteCode) {
      inviteCode = String(Math.floor(Math.random() * 1000000));
    }
    router.push(`/web-rtc/room?room=${inviteCode}`);
  };

  return (
    <main id="room__lobby__container">
      <div id="form__container">
        <div id="form__container__header">
          <p>👋 Create or Join Room</p>
        </div>

        <form id="lobby__form" onSubmit={handleSubmit}>
          <div className="form__field__wrapper">
            <label>Your Name</label>
            <input
              type="text"
              name="name"
              required
              placeholder="Enter your display name..."
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          <div className="form__field__wrapper">
            <label>Room Name</label>
            <input
              type="text"
              name="room"
              placeholder="Enter room name..."
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
          </div>

          <div className="form__field__wrapper">
            <button type="submit">
              Go to Room
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
