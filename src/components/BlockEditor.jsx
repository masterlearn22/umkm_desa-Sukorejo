import React, { useState } from 'react';
import { Plus, Trash2, GripVertical, Image as ImageIcon, Type, Heading1, ListOrdered, Table } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableItem = ({ id, block, index, blocksLength, updateBlock, removeBlock, addBlock, showAddMenu, setShowAddMenu }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...(isDragging ? { zIndex: 50, opacity: 0.5 } : {})
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`relative group border border-transparent hover:border-stone-200 rounded-lg p-2 -mx-2 bg-white transition-colors ${!isDragging ? 'hover:z-40 focus-within:z-40' : ''} ${showAddMenu === id ? 'z-50' : ''}`}
    >
      
      {/* Drag Handle & Delete (Visible on hover) */}
      <div className="absolute -left-10 top-2 opacity-0 group-hover:opacity-100 flex flex-col items-center space-y-1 transition-opacity">
        <button type="button" {...attributes} {...listeners} className="text-stone-400 hover:text-stone-700 p-1 cursor-grab active:cursor-grabbing">
          <GripVertical size={16} />
        </button>
      </div>

      <div className="absolute -right-10 top-2 opacity-0 group-hover:opacity-100 flex items-center space-x-1 transition-opacity">
        <button type="button" onClick={() => removeBlock(id)} className="text-stone-400 hover:text-red-500 p-1" disabled={blocksLength === 1}>
          <Trash2 size={16} />
        </button>
      </div>

      {/* Block Content Input */}
      <div className="flex-1 px-4">
        {block.type === 'heading' && (
          <input
            type="text"
            placeholder="Heading..."
            value={block.content}
            onChange={(e) => updateBlock(id, e.target.value)}
            className="w-full text-2xl font-bold bg-transparent outline-none placeholder-stone-300 py-2"
          />
        )}
        
        {block.type === 'paragraph' && (
          <textarea
            placeholder="Tulis sesuatu atau ketik / untuk menu..."
            value={block.content}
            onChange={(e) => {
              updateBlock(id, e.target.value);
              // Auto-resize
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                addBlock(index, 'paragraph');
              }
            }}
            className="w-full bg-transparent outline-none resize-none placeholder-stone-300 leading-relaxed text-stone-700 min-h-[40px] overflow-hidden py-1"
          />
        )}

        {block.type === 'image' && (
          <div className="space-y-2 py-2">
            {!block.content ? (
              <div className="bg-stone-50 border-2 border-dashed border-stone-200 rounded-xl p-6 text-center">
                <ImageIcon size={24} className="mx-auto text-stone-400 mb-2" />
                <input
                  type="text"
                  placeholder="Paste URL gambar di sini..."
                  value={block.content}
                  onChange={(e) => updateBlock(id, e.target.value)}
                  className="w-full max-w-sm bg-white border border-stone-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>
            ) : (
              <div className="relative group/img">
                <img src={block.content} alt="Block content" className="w-full max-h-96 rounded-xl object-contain bg-stone-100 border border-stone-200" />
                <div className="absolute top-2 right-2 opacity-0 group-hover/img:opacity-100 transition-opacity">
                  <input
                    type="text"
                    value={block.content}
                    onChange={(e) => updateBlock(id, e.target.value)}
                    className="bg-white/90 px-3 py-1 text-sm rounded shadow-sm border border-stone-200 outline-none w-64"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {block.type === 'list' && (
          <div className="flex">
            <div className="pt-2 text-stone-400 font-bold mr-2 flex-shrink-0">1.</div>
            <textarea
              placeholder="Item pertama... (tekan Enter untuk item baru ke bawah)"
              value={block.content}
              onChange={(e) => {
                updateBlock(id, e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
              className="w-full bg-transparent outline-none resize-none placeholder-stone-300 leading-relaxed text-stone-700 min-h-[40px] overflow-hidden py-1"
            />
          </div>
        )}

        {block.type === 'table' && (() => {
          let tableData;
          try {
            tableData = JSON.parse(block.content || '[["",""],["",""]]');
            if (!Array.isArray(tableData)) tableData = [["", ""], ["", ""]];
          } catch {
            tableData = [["", ""], ["", ""]];
          }
          const updateCell = (r, c, val) => {
            const newData = [...tableData];
            newData[r] = [...newData[r]];
            newData[r][c] = val;
            updateBlock(id, JSON.stringify(newData));
          };
          const addRow = () => {
            const cols = tableData[0].length;
            const newData = [...tableData, new Array(cols).fill("")];
            updateBlock(id, JSON.stringify(newData));
          };
          const addCol = () => {
            const newData = tableData.map(row => [...row, ""]);
            updateBlock(id, JSON.stringify(newData));
          };
          return (
            <div className="w-full overflow-x-auto py-2">
              <table className="w-full border-collapse border border-stone-200 rounded-lg overflow-hidden shadow-sm">
                <tbody>
                  {tableData.map((row, r) => (
                    <tr key={r}>
                      {row.map((cell, c) => (
                        <td key={c} className="border border-stone-200 p-0">
                          <input
                            type="text"
                            value={cell}
                            onChange={(e) => updateCell(r, c, e.target.value)}
                            className={`w-full px-3 py-2 outline-none ${r === 0 ? 'bg-stone-100 font-bold text-stone-800' : 'bg-transparent text-stone-700'} focus:bg-white focus:ring-1 focus:ring-emerald-500 text-sm`}
                            placeholder={r === 0 ? "Header..." : "Data..."}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex gap-4 mt-3">
                <button type="button" onClick={addRow} className="text-xs text-stone-500 hover:text-emerald-600 font-medium">+ Tambah Baris Bawah</button>
                <button type="button" onClick={addCol} className="text-xs text-stone-500 hover:text-emerald-600 font-medium">+ Tambah Kolom Kanan</button>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Add Menu below block */}
      <div className="absolute left-0 -bottom-3 opacity-0 group-hover:opacity-100 transition-opacity z-20">
        <button 
          type="button"
          onClick={() => setShowAddMenu(showAddMenu === id ? null : id)}
          className="bg-white border border-stone-200 rounded-full p-1 text-stone-400 hover:text-emerald-600 hover:border-emerald-600 shadow-sm"
        >
          <Plus size={16} />
        </button>
        
        {showAddMenu === id && (
          <div className="absolute top-8 left-0 bg-white border border-stone-200 rounded-lg shadow-xl py-2 flex space-x-1 px-2 z-30 min-w-max">
            <button type="button" onClick={() => addBlock(index, 'paragraph')} className="flex items-center space-x-2 px-3 py-2 text-sm text-stone-700 hover:bg-stone-100 rounded-md">
              <Type size={16} /> <span>Teks</span>
            </button>
            <button type="button" onClick={() => addBlock(index, 'heading')} className="flex items-center space-x-2 px-3 py-2 text-sm text-stone-700 hover:bg-stone-100 rounded-md">
              <Heading1 size={16} /> <span>Heading</span>
            </button>
            <button type="button" onClick={() => addBlock(index, 'image')} className="flex items-center space-x-2 px-3 py-2 text-sm text-stone-700 hover:bg-stone-100 rounded-md">
              <ImageIcon size={16} /> <span>Gambar</span>
            </button>
            <button type="button" onClick={() => addBlock(index, 'list')} className="flex items-center space-x-2 px-3 py-2 text-sm text-stone-700 hover:bg-stone-100 rounded-md">
              <ListOrdered size={16} /> <span>List Angka</span>
            </button>
            <button type="button" onClick={() => addBlock(index, 'table')} className="flex items-center space-x-2 px-3 py-2 text-sm text-stone-700 hover:bg-stone-100 rounded-md">
              <Table size={16} /> <span>Tabel</span>
            </button>
          </div>
        )}
      </div>
      
    </div>
  );
};

const BlockEditor = ({ blocks, onChange }) => {
  const [showAddMenu, setShowAddMenu] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }, // to allow clicking on inputs
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Default empty block if none exists
  if (!blocks || blocks.length === 0) {
    onChange([{ id: Date.now().toString(), type: 'paragraph', content: '' }]);
    return null;
  }

  const updateBlock = (id, newContent) => {
    onChange(blocks.map(b => b.id === id ? { ...b, content: newContent } : b));
  };

  const addBlock = (index, type) => {
    const newBlock = { id: Date.now().toString(), type, content: '' };
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    onChange(newBlocks);
    setShowAddMenu(null);
  };

  const removeBlock = (id) => {
    if (blocks.length === 1) return; // Keep at least one block
    onChange(blocks.filter(b => b.id !== id));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over.id);
      onChange(arrayMove(blocks, oldIndex, newIndex));
    }
  };

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext 
        items={blocks.map(b => b.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {blocks.map((block, index) => (
            <SortableItem 
              key={block.id} 
              id={block.id} 
              block={block} 
              index={index}
              blocksLength={blocks.length}
              updateBlock={updateBlock}
              removeBlock={removeBlock}
              addBlock={addBlock}
              showAddMenu={showAddMenu}
              setShowAddMenu={setShowAddMenu}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default BlockEditor;
