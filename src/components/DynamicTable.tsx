import React from 'react';
import { 
  Plus, 
  Trash2, 
  Copy, 
  ChevronUp, 
  ChevronDown, 
  Sparkles, 
  HelpCircle,
  GripVertical
} from 'lucide-react';

export interface DynamicTableColumn<T = any> {
  key: string;
  header: string | React.ReactNode;
  width?: string;
  minWidth?: string;
  align?: 'left' | 'center' | 'right';
  render: (item: T, index: number) => React.ReactNode;
}

export interface DynamicTableProps<T = any> {
  title?: string;
  subtitle?: string;
  description?: string;
  data: T[];
  columns: DynamicTableColumn<T>[];
  onAddRow: () => void;
  onDeleteRow: (index: number) => void;
  onMoveRow?: (index: number, direction: 'up' | 'down') => void;
  onDuplicateRow?: (index: number) => void;
  addButtonLabel?: string;
  emptyMessage?: string;
  headerRightContent?: React.ReactNode;
  showActionsColumn?: boolean;
  actionsColumnWidth?: string;
  className?: string;
}

export function DynamicTable<T extends { id?: string } = any>({
  title,
  subtitle,
  description,
  data,
  columns,
  onAddRow,
  onDeleteRow,
  onMoveRow,
  onDuplicateRow,
  addButtonLabel = 'Add Row',
  emptyMessage = 'No records in this table yet. Click Add Row to insert a new entry.',
  headerRightContent,
  showActionsColumn = true,
  actionsColumnWidth = 'w-24',
  className = '',
}: DynamicTableProps<T>) {
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Table Title & Action Bar */}
      {(title || addButtonLabel || headerRightContent) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            {title && (
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900">{title}</h4>
                <span className="inline-flex items-center px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold font-mono rounded-full border border-slate-200 whitespace-nowrap shrink-0">
                  {data.length} {data.length === 1 ? 'row' : 'rows'}
                </span>
              </div>
            )}
            {(subtitle || description) && (
              <p className="text-xs text-slate-500 mt-0.5">{subtitle || description}</p>
            )}
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {headerRightContent}
            <button
              type="button"
              onClick={onAddRow}
              className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
              title="Add a new row to this table"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{addButtonLabel}</span>
            </button>
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100/90 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px] select-none">
              <tr>
                {columns.map((col, cIdx) => (
                  <th
                    key={col.key || cIdx}
                    className={`p-2.5 font-bold ${
                      col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                    } ${col.width || ''}`}
                    style={{ minWidth: col.minWidth }}
                  >
                    {col.header}
                  </th>
                ))}
                {showActionsColumn && (
                  <th className={`p-2.5 text-center font-bold ${actionsColumnWidth}`}>
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {data.length > 0 ? (
                data.map((item, idx) => {
                  const key = item.id || `row-${idx}`;
                  return (
                    <tr
                      key={key}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {columns.map((col, cIdx) => (
                        <td
                          key={col.key || cIdx}
                          className={`p-2 align-top ${
                            col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                          }`}
                        >
                          {col.render(item, idx)}
                        </td>
                      ))}

                      {showActionsColumn && (
                        <td className="p-2 align-top text-center">
                          <div className="flex items-center justify-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                            {/* Move Up */}
                            {onMoveRow && (
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => onMoveRow(idx, 'up')}
                                className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 rounded hover:bg-slate-100 transition-colors cursor-pointer disabled:cursor-not-allowed"
                                title="Move row up"
                              >
                                <ChevronUp className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Move Down */}
                            {onMoveRow && (
                              <button
                                type="button"
                                disabled={idx === data.length - 1}
                                onClick={() => onMoveRow(idx, 'down')}
                                className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 rounded hover:bg-slate-100 transition-colors cursor-pointer disabled:cursor-not-allowed"
                                title="Move row down"
                              >
                                <ChevronDown className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Duplicate */}
                            {onDuplicateRow && (
                              <button
                                type="button"
                                onClick={() => onDuplicateRow(idx)}
                                className="p-1 text-slate-400 hover:text-blue-600 rounded hover:bg-blue-50 transition-colors cursor-pointer"
                                title="Duplicate row"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => onDeleteRow(idx)}
                              className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors cursor-pointer"
                              title="Delete row"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={columns.length + (showActionsColumn ? 1 : 0)}
                    className="p-8 text-center"
                  >
                    <div className="flex flex-col items-center justify-center text-slate-400 space-y-2">
                      <p className="text-xs font-medium">{emptyMessage}</p>
                      <button
                        type="button"
                        onClick={onAddRow}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Insert First Row</span>
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
