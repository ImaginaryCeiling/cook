"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Upload } from "lucide-react";

interface ImageUploadProps {
  name: string;
}

export function ImageUpload({ name }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleThumbnailClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div 
        onClick={handleThumbnailClick}
        className="relative flex aspect-square w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:bg-muted"
      >
        {preview ? (
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Upload className="h-8 w-8" />
            <span className="text-sm font-medium">Tap to upload photo</span>
          </div>
        )}
      </div>
      <Input
        ref={fileInputRef}
        type="file"
        name={name}
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        required
      />
      {preview && (
         <Button 
           variant="outline" 
           size="sm" 
           type="button" 
           onClick={() => {
             setPreview(null);
             if (fileInputRef.current) fileInputRef.current.value = "";
           }}
         >
           Remove Photo
         </Button>
      )}
    </div>
  );
}

