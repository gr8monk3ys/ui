"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { DemoBlock } from "@/components/gallery/demo-block";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const FRUITS = ["Apple", "Banana", "Cherry", "Elderberry"];

const contactSchema = z.object({
  name: z.string().min(2, "Give us at least two characters."),
});

function ContactFormDemo() {
  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "" },
  });
  return (
    <Form {...form}>
      <form className="grid max-w-sm gap-4" onSubmit={form.handleSubmit(() => undefined)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input autoComplete="name" placeholder="Ada Lovelace…" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="primary" className="w-fit">Submit</Button>
      </form>
    </Form>
  );
}

export function FormsDemos() {
  const [date, setDate] = useState<Date | undefined>(undefined);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <DemoBlock label="INPUT + LABEL" items={["input", "label"]}>
        <div className="grid max-w-sm gap-2">
          <Label htmlFor="email-demo">Email</Label>
          <Input
            id="email-demo"
            name="email"
            type="email"
            autoComplete="email"
            spellCheck={false}
            placeholder="you@example.com…"
          />
        </div>
      </DemoBlock>

      <DemoBlock label="TEXTAREA" items={["textarea"]}>
        <Textarea
          className="max-w-sm"
          name="note"
          aria-label="Note"
          autoComplete="off"
          placeholder="e.g. Ship the release notes…"
        />
      </DemoBlock>

      <DemoBlock label="SELECT" items={["select"]}>
        <Select>
          <SelectTrigger className="w-48" aria-label="Fruit"><SelectValue placeholder="e.g. Apple…" /></SelectTrigger>
          <SelectContent>
            {FRUITS.map((f) => <SelectItem key={f} value={f.toLowerCase()}>{f}</SelectItem>)}
          </SelectContent>
        </Select>
      </DemoBlock>

      <DemoBlock label="NATIVE-SELECT" items={["native-select"]}>
        <NativeSelect className="w-48" name="fruit" aria-label="Fruit">
          {FRUITS.map((f) => <option key={f}>{f}</option>)}
        </NativeSelect>
      </DemoBlock>

      <DemoBlock label="COMBOBOX" items={["combobox"]}>
        <Combobox items={FRUITS}>
          <ComboboxInput
            name="fruit-search"
            aria-label="Search fruit"
            autoComplete="off"
            placeholder="Search fruit…"
            className="w-56"
          />
          <ComboboxContent>
            <ComboboxEmpty>No fruit found.</ComboboxEmpty>
            <ComboboxList>
              {(item: string) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </DemoBlock>

      <DemoBlock label="CHECKBOX + SWITCH" items={["checkbox", "switch"]}>
        <div className="flex items-center gap-8">
          <label className="flex items-center gap-2 text-sm"><Checkbox name="subscribed" defaultChecked /> Subscribed</label>
          <label className="flex items-center gap-2 text-sm"><Switch name="dark-mode" defaultChecked /> Dark Mode</label>
        </div>
      </DemoBlock>

      <DemoBlock label="RADIO-GROUP" items={["radio-group"]}>
        <RadioGroup name="topic" aria-label="Topic" defaultValue="essays" className="flex gap-6">
          {["essays", "photos", "code"].map((v) => (
            <label key={v} className="flex items-center gap-2 text-sm capitalize"><RadioGroupItem value={v} /> {v}</label>
          ))}
        </RadioGroup>
      </DemoBlock>

      <DemoBlock label="SLIDER" items={["slider"]}>
        <Slider name="volume" aria-label="Volume" defaultValue={[40]} max={100} step={1} className="max-w-sm" />
      </DemoBlock>

      <DemoBlock label="TOGGLE + TOGGLE-GROUP" items={["toggle", "toggle-group"]}>
        <div className="flex items-center gap-6">
          <Toggle aria-label="Bold">B</Toggle>
          <ToggleGroup type="multiple" defaultValue={["a"]}>
            <ToggleGroupItem value="a">Left</ToggleGroupItem>
            <ToggleGroupItem value="b">Center</ToggleGroupItem>
            <ToggleGroupItem value="c">Right</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </DemoBlock>

      <DemoBlock label="BUTTON-GROUP" items={["button-group"]}>
        <ButtonGroup>
          <Button variant="outline">Day</Button>
          <Button variant="outline">Week</Button>
          <Button variant="outline">Month</Button>
        </ButtonGroup>
      </DemoBlock>

      <DemoBlock label="INPUT-GROUP" items={["input-group"]}>
        <InputGroup className="max-w-sm">
          <InputGroupAddon><InputGroupText>https://</InputGroupText></InputGroupAddon>
          <InputGroupInput
            name="website"
            aria-label="Website"
            type="url"
            inputMode="url"
            autoComplete="url"
            spellCheck={false}
            placeholder="lscaturchio.xyz…"
          />
        </InputGroup>
      </DemoBlock>

      <DemoBlock label="INPUT-OTP" items={["input-otp"]}>
        <InputOTP maxLength={6} name="otp" aria-label="One-time code" autoComplete="one-time-code">
          <InputOTPGroup>
            <InputOTPSlot index={0} /><InputOTPSlot index={1} /><InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} /><InputOTPSlot index={4} /><InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </DemoBlock>

      <DemoBlock label="FIELD" items={["field"]}>
        <Field className="max-w-sm">
          <FieldLabel htmlFor="handle-demo">Handle</FieldLabel>
          <Input
            id="handle-demo"
            name="handle"
            autoComplete="username"
            spellCheck={false}
            placeholder="@gr8monk3ys…"
          />
          <FieldDescription>Shown on your public profile.</FieldDescription>
        </Field>
      </DemoBlock>

      <DemoBlock label="FORM (react-hook-form + zod)" items={["form"]}>
        <ContactFormDemo />
      </DemoBlock>

      <DemoBlock label="CALENDAR" items={["calendar"]}>
        <Calendar mode="single" selected={date} onSelect={setDate} />
      </DemoBlock>

      <DemoBlock label="BUTTON" items={["button"]}>
        <div className="flex flex-wrap items-center gap-3">
          <Button>Default</Button>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="destructive">Destructive</Button>
          <Button disabled>Disabled</Button>
        </div>
      </DemoBlock>
    </div>
  );
}
