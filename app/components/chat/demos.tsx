import { FileText } from "lucide-react";

import { DemoBlock } from "@/components/gallery/demo-block";
import { NoPreviewCard } from "@/components/gallery/no-preview-card";
import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment";
import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageGroup,
} from "@/components/ui/message";

export function ChatDemos() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <DemoBlock label="MESSAGE" items={["message"]}>
        <MessageGroup>
          <Message align="end">
            <MessageContent className="bg-primary text-primary-foreground rounded-2xl">
              Can I reuse the site identity in new apps?
            </MessageContent>
          </Message>
          <Message>
            <MessageAvatar className="label-mono flex h-8 w-8 items-center justify-center">LS</MessageAvatar>
            <MessageContent className="surface rounded-2xl">
              Yes — one shadcn add away. Paper, green, and mono come along.
            </MessageContent>
          </Message>
        </MessageGroup>
      </DemoBlock>

      <DemoBlock label="BUBBLE" items={["bubble"]}>
        <BubbleGroup>
          <Bubble variant="default" className="self-end">
            <BubbleContent>Ship it.</BubbleContent>
          </Bubble>
          <Bubble variant="muted">
            <BubbleContent>Shipping — CI is already green.</BubbleContent>
          </Bubble>
        </BubbleGroup>
      </DemoBlock>

      <DemoBlock label="ATTACHMENT" items={["attachment"]}>
        <Attachment className="max-w-sm">
          <AttachmentMedia><FileText className="h-4 w-4" /></AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>identity.css</AttachmentTitle>
            <AttachmentDescription>14 KB — tokens & gallery language</AttachmentDescription>
          </AttachmentContent>
        </Attachment>
      </DemoBlock>
      <NoPreviewCard
        label="MESSAGE-SCROLLER"
        name="message-scroller"
        reason="Pins a transcript to the bottom while tokens stream in, and lets go the moment you scroll up. There is nothing to see without a live stream behind it, so it ships without a demo rather than with a fake one."
      />
    </div>
  );
}
