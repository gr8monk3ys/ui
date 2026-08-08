import { CircleAlert, CircleCheck, Info } from "lucide-react";

import { DemoBlock } from "@/components/gallery/demo-block";
import { BreadcrumbNav } from "@/components/patterns/breadcrumb-nav";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Section, SectionHeader } from "@/components/ui/section";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

export default function FeedbackPage() {
  return (
    <main>
      <Section padding="compact">
        <BreadcrumbNav />
        <SectionHeader index="05.5" eyebrow="CATALOG" title="Feedback" />
        <div className="grid gap-8 lg:grid-cols-2">
          <DemoBlock label="ALERT">
            <div className="grid gap-3">
              <Alert>
                <Info />
                <AlertTitle>Filed under identity</AlertTitle>
                <AlertDescription>The default alert sits on card paper.</AlertDescription>
              </Alert>
              <Alert variant="success">
                <CircleCheck />
                <AlertTitle>Committed</AlertTitle>
                <AlertDescription>The registry build is green.</AlertDescription>
              </Alert>
              <Alert variant="warning">
                <CircleAlert />
                <AlertTitle>Heads up</AlertTitle>
                <AlertDescription>Two upstream items are unpublished.</AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <CircleAlert />
                <AlertTitle>Build failed</AlertTitle>
                <AlertDescription>The drift check wants a registry rebuild.</AlertDescription>
              </Alert>
            </div>
          </DemoBlock>

          <DemoBlock label="PROGRESS">
            <div className="grid max-w-sm gap-4">
              <Progress value={33} />
              <Progress value={80} />
            </div>
          </DemoBlock>

          <DemoBlock label="SPINNER">
            <div className="flex items-center gap-4">
              <Spinner />
              <span className="text-description-sm">Fetching the catalogue…</span>
            </div>
          </DemoBlock>

          <DemoBlock label="SKELETON (identity shimmer)">
            <div className="grid max-w-sm gap-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-20 w-full" />
            </div>
          </DemoBlock>
        </div>
      </Section>
    </main>
  );
}
