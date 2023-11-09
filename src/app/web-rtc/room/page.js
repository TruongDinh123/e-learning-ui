"use client";

import { useEffect, useState } from "react";
import "../../web-rtc/main.css";
import "../room/room.css";
import AgoraRTC from "agora-rtc-sdk-ng";
import { Spin } from "antd";

export default function Room() {
  const API_ID = "88400195580549988f846a16e954de64";
  const [isLoading, setIsLoading] = useState(false);

  let uid;
  let token = null;
  let roomId = "main";

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLoading(true);
      uid = window.sessionStorage.getItem("uid");
      if (!uid) {
        uid = String(Math.floor(Math.random() * 1000000000));
        window.sessionStorage.setItem("uid", uid);
      }

      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      roomId = urlParams.get("room");
    }
  }, []);

  const init = async () => {
    const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    await client.join(API_ID, roomId, token, uid);
    setIsLoading(false);
  };
  init();
  return (
    <>
      {isLoading ? (
        <Spin />
      ) : (
        <div id="room__container">
          <section id="members__container">
            <div id="members__header">
              <p>Participants</p>
              <strong id="members__count">27</strong>
            </div>

            <div id="member__list">
              <div className="member__wrapper" id="member__1__wrapper">
                <span className="green__icon"></span>
                <p className="member_name">Sulammita</p>
              </div>

              <div className="member__wrapper" id="member__2__wrapper">
                <span className="green__icon"></span>
                <p className="member_name">Dennis Ivy</p>
              </div>

              <div className="member__wrapper" id="member__2__wrapper">
                <span className="green__icon"></span>
                <p className="member_name">Shahriar P. Shuvo 👋:</p>
              </div>

              <div className="member__wrapper" id="member__1__wrapper">
                <span className="green__icon"></span>
                <p className="member_name">Sulammita</p>
              </div>

              <div className="member__wrapper" id="member__2__wrapper">
                <span className="green__icon"></span>
                <p className="member_name">Dennis Ivy</p>
              </div>

              <div className="member__wrapper" id="member__2__wrapper">
                <span className="green__icon"></span>
                <p className="member_name">Shahriar P. Shuvo 👋:</p>
              </div>

              <div className="member__wrapper" id="member__1__wrapper">
                <span className="green__icon"></span>
                <p className="member_name">Sulammita</p>
              </div>

              <div className="member__wrapper" id="member__2__wrapper">
                <span className="green__icon"></span>
                <p className="member_name">Dennis Ivy</p>
              </div>

              <div className="member__wrapper" id="member__2__wrapper">
                <span className="green__icon"></span>
                <p className="member_name">Shahriar P. Shuvo 👋:</p>
              </div>

              <div className="member__wrapper" id="member__1__wrapper">
                <span className="green__icon"></span>
                <p className="member_name">Sulammita</p>
              </div>

              <div className="member__wrapper" id="member__2__wrapper">
                <span className="green__icon"></span>
                <p className="member_name">Dennis Ivy</p>
              </div>
              <div className="member__wrapper" id="member__2__wrapper">
                <span className="green__icon"></span>
                <p className="member_name">Dennis Ivy</p>
              </div>

              <div className="member__wrapper" id="member__2__wrapper">
                <span className="green__icon"></span>
                <p className="member_name">Shahriar P. Shuvo 👋:</p>
              </div>

              <div className="member__wrapper" id="member__1__wrapper">
                <span className="green__icon"></span>
                <p className="member_name">Sulammita</p>
              </div>

              <div className="member__wrapper" id="member__2__wrapper">
                <span className="green__icon"></span>
                <p className="member_name">Dennis Ivy</p>
              </div>

              <div className="member__wrapper" id="member__2__wrapper">
                <span className="green__icon"></span>
                <p className="member_name">Shahriar P. Shuvo 👋:</p>
              </div>

              <div className="member__wrapper" id="member__1__wrapper">
                <span className="green__icon"></span>
                <p className="member_name">Sulammita</p>
              </div>

              <div className="member__wrapper" id="member__2__wrapper">
                <span className="green__icon"></span>
                <p className="member_name">Dennis Ivy</p>
              </div>

              <div className="member__wrapper" id="member__2__wrapper">
                <span className="green__icon"></span>
                <p className="member_name">Shahriar P. Shuvo 👋:</p>
              </div>

              <div className="member__wrapper" id="member__1__wrapper">
                <span className="green__icon"></span>
                <p className="member_name">Sulammita</p>
              </div>

              <div className="member__wrapper" id="member__2__wrapper">
                <span className="green__icon"></span>
                <p className="member_name">Dennis Ivy</p>
              </div>
              <div className="member__wrapper" id="member__2__wrapper">
                <span className="green__icon"></span>
                <p className="member_name">Dennis Ivy</p>
              </div>
            </div>
          </section>

          <section id="stream__container">
            <div id="stream_box"></div>

            <div id="streams_container">
              <div className="video_container" id="user-container-1">
                <h1>1</h1>
              </div>
              <div className="video_container" id="user-container-2">
                <h1>2</h1>
              </div>
              <div className="video_container" id="user-container-3">
                <h1>3</h1>
              </div>
              <div className="video_container" id="user-container-4">
                <h1>4</h1>
              </div>
            </div>
            <div className="stream__actions">
              <button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 4h-3v-1h3v1zm10.93 0l.812 1.219c.743 1.115 1.987 1.781 3.328 1.781h1.93v13h-20v-13h3.93c1.341 0 2.585-.666 3.328-1.781l.812-1.219h5.86zm1.07-2h-8l-1.406 2.109c-.371.557-.995.891-1.664.891h-5.93v17h24v-17h-3.93c-.669 0-1.293-.334-1.664-.891l-1.406-2.109zm-11 8c0-.552-.447-1-1-1s-1 .448-1 1 .447 1 1 1 1-.448 1-1zm7 0c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3zm0-2c-2.761 0-5 2.239-5 5s2.239 5 5 5 5-2.239 5-5-2.239-5-5-5z" />
                </svg>
              </button>
              <button className="active">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2c1.103 0 2 .897 2 2v7c0 1.103-.897 2-2 2s-2-.897-2-2v-7c0-1.103.897-2 2-2zm0-2c-2.209 0-4 1.791-4 4v7c0 2.209 1.791 4 4 4s4-1.791 4-4v-7c0-2.209-1.791-4-4-4zm8 9v2c0 4.418-3.582 8-8 8s-8-3.582-8-8v-2h2v2c0 3.309 2.691 6 6 6s6-2.691 6-6v-2h2zm-7 13v-2h-2v2h-4v2h10v-2h-4z" />
                </svg>
              </button>
              <button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M0 1v17h24v-17h-24zm22 15h-20v-13h20v13zm-6.599 4l2.599 3h-12l2.599-3h6.802z" />
                </svg>
              </button>
              <button>
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
            <div id="messages">
              <div className="message__wrapper">
                <div className="message__body__bot">
                  <strong className="message__author__bot">
                    🤖 Mumble Bot
                  </strong>
                  <p className="message__text__bot">
                    Welcome to the room, dont be shy, say hello!
                  </p>
                </div>
              </div>

              <div className="message__wrapper">
                <div className="message__body__bot">
                  <strong className="message__author__bot">
                    🤖 Mumble Bot
                  </strong>
                  <p className="message__text__bot">
                    Dennis Ivy just entered the room!
                  </p>
                </div>
              </div>

              <div className="message__wrapper">
                <div className="message__body">
                  <strong className="message__author">Dennis Ivy</strong>
                  <p className="message__text">
                    Does anyone know hen he will be back?
                  </p>
                </div>
              </div>

              <div className="message__wrapper">
                <div className="message__body__bot">
                  <strong className="message__author__bot">
                    🤖 Mumble Bot
                  </strong>
                  <p className="message__text__bot">
                    Sulamita just entered the room!
                  </p>
                </div>
              </div>

              <div className="message__wrapper">
                <div className="message__body__bot">
                  <strong className="message__author__bot">
                    🤖 Mumble Bot
                  </strong>
                  <p className="message__text__bot">
                    Shahriar P. Shuvo just entered the room!
                  </p>
                </div>
              </div>

              <div className="message__wrapper">
                <div className="message__body">
                  <strong className="message__author">Sulamita</strong>
                  <p className="message__text"> Great stream!</p>
                </div>
              </div>

              <div className="message__wrapper">
                <div className="message__body">
                  <strong className="message__author">Dennis Ivy</strong>
                  <p className="message__text">
                    {" "}
                    Convert RGB color codes to HEX HTML format for use in web
                    design and CSS.
                  </p>
                </div>
              </div>

              <div className="message__wrapper">
                <div className="message__body">
                  <strong className="message__author">
                    Shahriar P. Shuvo 👋
                  </strong>
                  <p className="message__text">
                    Does anyone know hen he will be back?
                  </p>
                </div>
              </div>
              <div className="message__wrapper">
                <div className="message__body">
                  <strong className="message__author">Sulamita</strong>
                  <p className="message__text">Great stream!</p>
                </div>
              </div>

              <div className="message__wrapper">
                <div className="message__body">
                  <strong className="message__author">Dennis Ivy</strong>
                  <p className="message__text">
                    Convert RGB color codes to HEX HTML format for use in web
                    design and CSS.
                  </p>
                </div>
              </div>

              <div className="message__wrapper">
                <div className="message__body">
                  <strong className="message__author">
                    Shahriar P. Shuvo 👋
                  </strong>
                  <p className="message__text">
                    Does anyone know hen he will be back?
                  </p>
                </div>
              </div>

              <div className="message__wrapper">
                <div className="message__body">
                  <strong className="message__author">Sulamita</strong>
                  <p className="message__text">Great stream!</p>
                </div>
              </div>

              <div className="message__wrapper">
                <div className="message__body__bot">
                  <strong className="message__author__bot">
                    🤖 Mumble Bot
                  </strong>
                  <p className="message__text__bot">
                    👋 Sulamita has left the room
                  </p>
                </div>
              </div>

              <div className="message__wrapper">
                <div className="message__body">
                  <strong className="message__author">Dennis Ivy</strong>
                  <p className="message__text">
                    Convert RGB color codes to HEX HTML format for use in web
                    design and CSS.
                  </p>
                </div>
              </div>

              <div className="message__wrapper">
                <div className="message__body">
                  <strong className="message__author">
                    Shahriar P. Shuvo 👋
                  </strong>
                  <p className="message__text">
                    Does anyone know hen he will be back?
                  </p>
                </div>
              </div>
            </div>

            <form id="message__form">
              <input
                type="text"
                name="message"
                placeholder="Send a message...."
              />
            </form>
          </section>
        </div>
      )}
    </>
  );
}
