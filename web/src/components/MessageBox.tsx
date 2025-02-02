import "../assets/css/messagebox.css";

interface MessageProps {
  message: string;
}

function MessageBox(message: MessageProps) {
  function removeMessage() {
    const messagebox = document.getElementById("messagebox");
    if (messagebox) {
      while (messagebox.hasChildNodes()) {
        messagebox.removeChild(messagebox.firstElementChild!);
      }
    }
  }

  return (
    <>
      <div className="modal-background">
        <div className="modal-box">
          <p>{message.message}</p>
          <button onClick={removeMessage}>OK</button>
        </div>
      </div>
    </>
  );
}

export default MessageBox;
