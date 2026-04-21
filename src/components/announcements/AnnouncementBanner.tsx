import { useState, useEffect, useRef, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Pencil, Check, X, Info } from "lucide-react";
import { toast } from "sonner";

interface Announcement {
  id: string;
  content: string;
  updated_at: string;
}

interface Envelope<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export function AnnouncementBanner() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autoResize = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, []);

  useEffect(() => {
    if (isEditing) autoResize();
  }, [isEditing, autoResize]);

  useEffect(() => {
    fetchAnnouncement();
  }, []);

  const fetchAnnouncement = async () => {
    const res = await fetch("/api/announcement");
    const env = (await res.json()) as Envelope<Announcement | null>;
    if (!env.success) return;
    if (env.data) {
      setAnnouncement(env.data);
      setEditContent(env.data.content);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(announcement?.content || "");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditContent(announcement?.content || "");
  };

  const handleSave = async () => {
    if (!announcement) return;

    setLoading(true);
    const res = await fetch("/api/announcement", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: announcement.id, content: editContent }),
    });
    const env = (await res.json()) as Envelope<Announcement>;
    setLoading(false);

    if (!env.success || !env.data) {
      toast.error(env.error ?? "Failed to save announcement");
      return;
    }

    setAnnouncement(env.data);
    setIsEditing(false);
    toast.success("Announcement saved");
  };

  if (!announcement?.content && !isEditing) {
    return (
      <div className="flex justify-center mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleEdit}
          className="text-muted-foreground hover:text-foreground"
        >
          <Pencil className="h-4 w-4 mr-2" />
          Add announcement
        </Button>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="mb-4 p-4 rounded-lg border border-l-4 border-l-accent bg-accent/5">
        <Textarea
          ref={textareaRef}
          value={editContent}
          onChange={(e) => {
            setEditContent(e.target.value);
            autoResize();
          }}
          placeholder="Enter announcement or important notes..."
          className="min-h-[80px] mb-3 bg-background resize-none overflow-hidden"
          autoFocus
        />
        <div className="flex gap-2 justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            disabled={loading}
          >
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave} disabled={loading}>
            <Check className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4 p-4 rounded-lg border border-l-4 border-l-accent bg-accent/5 group relative">
      <div className="flex items-start gap-2.5">
        <Info className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
        <p className="text-base font-medium leading-relaxed whitespace-pre-wrap pr-8">
          {announcement?.content}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleEdit}
        className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Pencil className="h-4 w-4" />
      </Button>
    </div>
  );
}
