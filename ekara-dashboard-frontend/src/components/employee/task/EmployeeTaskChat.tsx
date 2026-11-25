"use client";

import { UserRound } from "lucide-react";

import EmployeeTaskChatHeader, {
  EmployeeTaskChatHeaderData,
} from "@/src/components/employee/task/EmployeeTaskChatHeader";

import EmployeeTaskMessage, {
  EmployeeTaskMessageData,
} from "@/src/components/employee/task/EmployeeTaskMessage";

import EmployeeTaskMessageGroup from "@/src/components/employee/task/EmployeeTaskMessageGroup";

import EmployeeTaskComposer from "@/src/components/employee/task/EmployeeTaskComposer";

/* ========================= Types ========================= */

export interface EmployeeTaskChatData
  extends EmployeeTaskChatHeaderData {
  description?: string | null;
}

/* ========================= Props ========================= */

interface EmployeeTaskChatProps {
  task?: EmployeeTaskChatData | null;

  messages?: EmployeeTaskMessageData[];

  onSendMessage?: (
    message: string,
    file?: File | null
  ) => void | Promise<void>;

  onAttachmentClick?: () => void;

  onEmojiClick?: () => void;

  onMenuClick?: () => void;

  disabled?: boolean;

  isSending?: boolean;

  isUploading?: boolean;

  placeholder?: string;
}

/* ========================= Component ========================= */

export default function EmployeeTaskChat({
  task = null,
  messages = [],
  onSendMessage,
  onAttachmentClick,
  onEmojiClick,
  onMenuClick,
  disabled = false,
  isSending = false,
  isUploading = false,
  placeholder = "Write a message...",
}: EmployeeTaskChatProps) {
  /* ========================= Empty State ========================= */

  if (!task) {
    return (
      <section className="flex h-full min-h-0 flex-1 items-center justify-center bg-white">
        <div className="px-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
            <UserRound className="h-6 w-6 text-blue-500" />
          </div>

          <h3 className="text-sm font-semibold text-slate-800">
            Select a task
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Select a task from the sidebar to start
            a conversation.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex h-full min-h-0 flex-1 flex-col bg-white">
      {/* ========================= Chat Header ========================= */}

      <EmployeeTaskChatHeader
        task={task}
        onMenuClick={onMenuClick}
        disabled={disabled}
      />

      {/* ========================= Messages ========================= */}

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
        <div className="mx-auto flex max-w-4xl flex-col gap-4">
          {/* ========================= Conversation Divider ========================= */}

          <div className="flex items-center gap-3 py-2">
            <div className="h-px flex-1 bg-slate-200" />

            <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
              Conversation
            </span>

            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* ========================= Message List ========================= */}

          {messages.length > 0 ? (
            <EmployeeTaskMessageGroup
              messages={messages}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-slate-50">
                <UserRound className="h-5 w-5 text-slate-400" />
              </div>

              <p className="text-xs font-medium text-slate-600">
                No messages yet
              </p>

              <p className="mt-1 max-w-xs text-[10px] leading-5 text-slate-400">
                Start the conversation by sending
                a message to the task members.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ========================= Composer ========================= */}

      <EmployeeTaskComposer
        onSendMessage={onSendMessage}
        onAttachmentClick={onAttachmentClick}
        onEmojiClick={onEmojiClick}
        disabled={disabled}
        isSending={isSending}
        isUploading={isUploading}
        placeholder={placeholder}
      />
    </section>
  );
}