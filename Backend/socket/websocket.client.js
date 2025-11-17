import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export default function useSocket({
  url = "http://localhost:5000",
  onConnect,
  onDisconnect,
} = {}) {
  const socketRef = useRef(null);

  useEffect(() => {
    const endpoint = url || window.location.origin;
    const socket = io(endpoint, { transports: ["websocket", "polling"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      if (onConnect) onConnect(socket);
    });

    socket.on("disconnect", (reason) => {
      if (onDisconnect) onDisconnect(reason);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [url, onConnect, onDisconnect]);

  const joinRoom = (room) => {
    if (socketRef.current) socketRef.current.emit("joinScheduleRoom", room);
  };

  const leaveRoom = (room) => {
    if (socketRef.current) socketRef.current.emit("leaveBusTrackingRoom");
    if (socketRef.current)
      socketRef.current.leave && socketRef.current.leave(`schedule_${room}`);
  };

  const on = (event, cb) => {
    if (!socketRef.current) return;
    socketRef.current.on(event, cb);
  };

  const off = (event, cb) => {
    if (!socketRef.current) return;
    socketRef.current.off(event, cb);
  };

  const emit = (event, payload) => {
    if (!socketRef.current) return;
    socketRef.current.emit(event, payload);
  };

  return { joinRoom, leaveRoom, on, off, emit, socketRef };
}


/**
 * for frontend use
 * 
 * import React, { useEffect, useState, useCallback } from "react";
import useSocket from "../hooks/useSocket";
import { fetchScheduleStudents } from "../api/api";
import StudentList from "./StudentList";

// ...existing code...
export default function BusTracker({ scheduleId }) {
  const [students, setStudents] = useState([]);
  const [locations, setLocations] = useState({}); // keyed by bus_id
  const [status, setStatus] = useState("idle");

  const { joinRoom, leaveRoom, on, off } = useSocket({
    // url: "http://localhost:3000" // optional override
    onConnect: () => setStatus("connected"),
    onDisconnect: () => setStatus("disconnected"),
  });

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setStatus("loading");
        const s = await fetchScheduleStudents(scheduleId);
        if (!mounted) return;
        setStudents(s);
        setStatus("ready");
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [scheduleId]);

  useEffect(() => {
    if (!scheduleId) return;
    joinRoom(scheduleId);

    const handleLocation = (bus) => {
      // bus = { bus_id, lat, lng, speed, ... }
      setLocations((prev) => ({ ...prev, [bus.bus_id]: bus }));
    };

    const handleStudentList = (list) => {
      // optional server-sent list
      // merges with existing students
      setStudents((prev) => {
        // if server sends minimal info, just return it
        return Array.isArray(list) && list.length ? list : prev;
      });
    };

    on("locationUpdate", handleLocation);
    on("studentList", handleStudentList);

    return () => {
      off("locationUpdate", handleLocation);
      off("studentList", handleStudentList);
      leaveRoom(scheduleId);
    };
  }, [scheduleId, joinRoom, leaveRoom, on, off]);

  const renderLocations = useCallback(() => {
    const arr = Object.values(locations);
    if (arr.length === 0) return <div>No buses tracking yet.</div>;
    return (
      <div>
        {arr.map((b) => (
          <div key={b.bus_id} style={{ padding: 6, borderBottom: "1px solid #eee" }}>
            <div>Bus #{b.bus_id} — speed: {b.speed ?? "-"} km/h</div>
            <div style={{ fontSize: 13, color: "#333" }}>
              {b.lat?.toFixed(6)}, {b.lng?.toFixed(6)}
            </div>
          </div>
        ))}
      </div>
    );
  }, [locations]);

  return (
    <div>
      <h3>Schedule #{scheduleId} — socket status: {status}</h3>
      <div style={{ display: "flex", gap: 24 }}>
        <div style={{ flex: 1 }}>
          <h4>Students</h4>
          <StudentList students={students} />
        </div>
        <div style={{ width: 320 }}>
          <h4>Bus locations</h4>
          {renderLocations()}
        </div>
      </div>
    </div>
  );
}
 */