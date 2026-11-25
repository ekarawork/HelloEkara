"use client";

import TaskMessage, {
  TaskMessageData,
} from "@/src/components/admin/task/TaskMessage";

/* ========================= Props ========================= */

interface TaskMessageGroupProps {
  messages: TaskMessageData[];
}

/* ========================= Component ========================= */

export default function TaskMessageGroup({
  messages,
}: TaskMessageGroupProps) {
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
          <TaskMessage
            key={message.id}
            message={message}
            showSender={!isSameSender}
          />
        );
      })}
    </div>
  );
}
