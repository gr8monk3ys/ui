import { FileText } from "lucide-react";

import { DemoBlock } from "@/components/gallery/demo-block";
import { BreadcrumbNav } from "@/components/patterns/breadcrumb-nav";
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
import { Section, SectionHeader } from "@/components/ui/section";

export default function ChatPage() {
  return (
    <main>
      <Section padding="compact">
        <BreadcrumbNav />
        <SectionHeader index="05.7" eyebrow="CATALOG" title="AI chat"
          description="Static demos — the components are UI-only and plug into any chat backend. message-scroller ships in the registry; it needs a live stream to demo meaningfully." />
        <div className="grid gap-8 lg:grid-cols-2">
          <DemoBlock label="MESSAGE">
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

          <DemoBlock label="BUBBLE">
            <BubbleGroup>
              <Bubble variant="default" className="self-end">
                <BubbleContent>Ship it.</BubbleContent>
              </Bubble>
              <Bubble variant="muted">
                <BubbleContent>Shipping — CI is already green.</BubbleContent>
              </Bubble>
            </BubbleGroup>
          </DemoBlock>

          <DemoBlock label="ATTACHMENT">
            <Attachment className="max-w-sm">
              <AttachmentMedia><FileText className="h-4 w-4" /></AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>identity.css</AttachmentTitle>
                <AttachmentDescription>14 KB — tokens & gallery language</AttachmentDescription>
              </AttachmentContent>
            </Attachment>
          </DemoBlock>
        </div>
      </Section>
    </main>
  );
}
