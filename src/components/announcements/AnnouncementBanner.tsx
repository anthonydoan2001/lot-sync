import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Pencil, Check, X } from "lucide-react";
import { toast } from "sonner";

interface Announcement {
  id: string;
  content: string;
  updated_at: string;
}

export function AnnouncementBanner() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnnouncement();
  }, []);

  const fetchAnnouncement = async () => {
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching announcement:", error);
      return;
    }

    if (data) {
      setAnnouncement(data);
      setEditContent(data.content);
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
    const { error } = await supabase
      .from("announcements")
      .update({ content: editContent, updated_at: new Date().toISOString() })
      .eq("id", announcement.id);

    setLoading(false);

    if (error) {
      toast.error("Failed to save announcement");
      console.error("Error saving announcement:", error);
      return;
    }

    setAnnouncement({ ...announcement, content: editContent });
    setIsEditing(false);
    toast.success("Announcement saved");
  };

  // Don't show if empty and not editing
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
      <div className="mb-4 p-4 rounded-lg border bg-muted/50">
        <Textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          placeholder="Enter announcement or important notes..."
          className="min-h-[80px] mb-3 bg-background"
          autoFocus
        />
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" size="sm" onClick={handleCancel} disabled={loading}>
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
    <div className="mb-4 p-4 rounded-lg border bg-muted/50 group relative">
      <p className="text-sm whitespace-pre-wrap pr-8">{announcement?.content}</p>
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
