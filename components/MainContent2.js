import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

/*
  Navigation logic explanation
  ---------------------------------------------
  The dashboard previously had a 7-second timer that unconditionally
  redirected to /profile. That timer has been removed (see pages/dashboard.js).

  Now this component (MainContent2) is the sole authority for moving on
  from the diagnostics screen. It polls /api/backgroundcheckstatus every
  second:
    • If the status is PASS → shows "Background checks successful" then
      redirects to /profile.
    • If the status is FAIL → stays on this page, displays "Retrying..."
      and keeps retrying indefinitely until the API reports PASS.
*/

const MainContent = () => {
  const [stage, setStage] = useState("checking"); // checking, retrying, success
  const [severity, setSeverity] = useState(null); // good, critical
  const [attempt, setAttempt] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const runCheck = async () => {
      try {
        const res = await fetch("/api/backgroundcheckstatus");
        const data = await res.json();
        if (data.status === "PASS") {
          setSeverity("good");
          setStage("success");
          // give user a moment to read success message then navigate
          setTimeout(() => router.push("/profile"), 2000);
          return; // stop scheduling further checks
        }
        // if FAIL fall through
        throw new Error("Checks failed");
      } catch (err) {
        setSeverity("critical");
        setStage("retrying");
        setAttempt((prev) => prev + 1);
        setTimeout(runCheck, 1000); // retry after 1s
      }
    };

    runCheck();
  }, [router]);

  const renderText = () => {
    switch (stage) {
      case "checking":
        return `Running background checks... (attempt ${attempt})`;
      case "retrying":
        return `Checks failed. Retrying... (attempt ${attempt})`;
      case "success":
        return "Background checks successful.";
      default:
        return "";
    }
  };

  return (
    <main className="main-content" style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
      <div className="car-diagnostics" style={{position:'relative',left:'auto',transform:'none',display:'flex',flexDirection:'column',alignItems:'center'}}>
        <img
          src="/images/d2.svg"
          alt="Car Diagnostics"
          className="car-image fade-in-car-image"
          style={{maxWidth:'5000px',width:'120%',height:'auto',marginBottom:'20px',marginLeft:'50%'}}
        />
        <p className="diagnostic-text" style={{marginTop:'20px'}}>{renderText()}</p>
        <div className="loader-container" style={{marginTop:'12px'}}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="loader-dot"
              style={{
                backgroundColor: stage === "success" ? "#2cbe6b" : "#ffe600",
                animationDelay: `${i * 0.2}s`,
                animationPlayState: stage === "success" ? "paused" : "running",
              }}
            />
          ))}
        </div>
      </div>
      <style jsx>{`
        .diagnostic-text {
          color: #fff;
          font-size: 22px;
          font-family: "Urbanist", sans-serif;
          opacity: 1 !important;
        }
        .loader-dot {
          display: inline-block;
          width: 12px;
          height: 12px;
          margin: 0 5px;
          border-radius: 50%;
          animation: loaderBlink 1s infinite ease-in-out;
        }
        @keyframes loaderBlink {
          0%, 80%, 100% { opacity: 0.2; }
          40% { opacity: 1; }
        }
      `}</style>
    </main>
  );
};

export default MainContent;
