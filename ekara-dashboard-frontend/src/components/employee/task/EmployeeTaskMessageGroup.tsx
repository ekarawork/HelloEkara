"use client";

import EmployeeTaskMessage, {
  EmployeeTaskMessageData,
} from "@/src/components/employee/task/EmployeeTaskMessage";

/* ========================= Props ========================= */

interface EmployeeTaskMessageGroupProps {
  messages: EmployeeTaskMessageData[];
}

/* ========================= Component ========================= */

export default function EmployeeTaskMessageGroup({
  messages,
}: EmployeeTaskMessageGroupProps) {
  /* ========================= Empty State ========================= */

  if (!messages.length) {
    return null;
  }

  /* ========================= Message Group ========================= */

  return (
    <div className="flex flex-col gap-2">
      {messages.map((message, index) => {
        const previousMessage = messages[index - 1];

        const isSameSender =
          previousMessage?.senderId ===
          message.senderId;

        return (
          <EmployeeTaskMessage
            key={message.id}
            message={message}
            showSender={!isSameSender}
          />
        );
      })}
    </div>
  );
}