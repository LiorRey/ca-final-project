import { useState, useEffect, useRef } from "react";
import {
  socketService,
  SOCKET_EVENT_REVIEW_ABOUT_YOU,
} from "../services/socket-service";

export function UserMessage() {
  const [msg, setMsg] = useState(null);
  const timeoutIdRef = useRef();

  useEffect(() => {
    const unsubscribe = socketService.on("show-msg", msg => {
      setMsg(msg);
      if (timeoutIdRef.current) {
        timeoutIdRef.current = null;
        clearTimeout(timeoutIdRef.current);
      }
      timeoutIdRef.current = setTimeout(() => setMsg(null), 3000);
    });

    socketService.on(SOCKET_EVENT_REVIEW_ABOUT_YOU, review => {
      console.log(`New review about me ${review.txt}`);
    });

    return () => {
      unsubscribe();
      socketService.off(SOCKET_EVENT_REVIEW_ABOUT_YOU);
    };
  }, []);

  function closeMsg() {
    setMsg(null);
  }

  function msgClass() {
    return msg ? "visible" : "";
  }
  return (
    <section className={`user-msg ${msg?.type} ${msgClass()}`}>
      <button onClick={closeMsg}>x</button>
      {msg?.txt}
    </section>
  );
}
