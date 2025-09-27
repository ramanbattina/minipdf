'use client';

import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X, Image as ImageIcon } from 'lucide-react';
import { ImageFile } from '@/types';
import { formatFileSize } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ThumbnailItemProps {
  image: ImageFile;
  onRemove: (id: string) => void;
}

function ThumbnailItem({ image, onRemove }: ThumbnailItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative bg-white rounded-lg border border-gray-200 overflow-hidden',
        'hover:shadow-md transition-shadow',
        isDragging && 'opacity-50 shadow-lg'
      )}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 z-10 p-1 bg-white/80 rounded cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <GripVertical className="w-4 h-4 text-gray-600" />
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(image.id)}
        className="absolute top-2 right-2 z-10 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
        aria-label={`Remove ${image.name}`}
      >
        <X className="w-3 h-3" />
      </button>

      {/* Image Preview */}
      <div className="aspect-square bg-gray-100 flex items-center justify-center">
        {image.preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image.preview}
            alt={image.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to icon if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className="hidden flex flex-col items-center justify-center text-gray-400">
          <ImageIcon className="w-8 h-8 mb-2" />
          <span className="text-xs">Preview unavailable</span>
        </div>
      </div>

      {/* File Info */}
      <div className="p-3">
        <p className="text-sm font-medium text-gray-900 truncate" title={image.name}>
          {image.name}
        </p>
        <p className="text-xs text-gray-500">
          {formatFileSize(image.size)}
        </p>
      </div>
    </div>
  );
}

interface ThumbnailListProps {
  images: ImageFile[];
  onReorder: (images: ImageFile[]) => void;
  onRemove: (id: string) => void;
  maxImages?: number;
}

export default function ThumbnailList({ images, onReorder, onRemove, maxImages = 20 }: ThumbnailListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((image) => image.id === active.id);
      const newIndex = images.findIndex((image) => image.id === over.id);
      
      const newImages = arrayMove(images, oldIndex, newIndex);
      onReorder(newImages);
    }
  };

  if (images.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>No images uploaded yet</p>
        <p className="text-sm">Upload some images to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          Images ({images.length}/{maxImages})
        </h3>
        <p className="text-sm text-gray-500">
          Drag to reorder • Click × to remove
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={images.map(img => img.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((image) => (
              <ThumbnailItem
                key={image.id}
                image={image}
                onRemove={onRemove}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
