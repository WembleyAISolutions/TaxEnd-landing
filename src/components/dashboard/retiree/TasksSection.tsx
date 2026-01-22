/**
 * TasksSection Component
 * Tasks for Retiree dashboard
 */

'use client';

import React from 'react';
import { TaskItem } from '@/src/types/established-professional';
import { Circle, CheckCircle2, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface TasksSectionProps {
  tasks: TaskItem[];
  completedCount: number;
  totalCount: number;
  onToggleTask: (taskId: string) => void;
}

const priorityColors = {
  high: 'text-red-600 bg-red-100',
  medium: 'text-orange-600 bg-orange-100',
  low: 'text-blue-600 bg-blue-100',
};

const priorityLabels = {
  high: 'High',
  medium: 'Med',
  low: 'Low',
};

export default function TasksSection({
  tasks,
  completedCount,
  totalCount,
  onToggleTask,
}: TasksSectionProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">To-Do Tasks</h2>
        <span className="text-sm text-gray-600">
          {completedCount}/{totalCount} Completed
        </span>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`p-4 border rounded-xl transition-all ${
              task.isCompleted ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <button
                onClick={() => onToggleTask(task.id)}
                className="mt-0.5 flex-shrink-0"
              >
                {task.isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>

              <div className="flex-1">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3
                    className={`font-medium ${
                      task.isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'
                    }`}
                  >
                    {task.title}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${
                      priorityColors[task.priority]
                    }`}
                  >
                    {priorityLabels[task.priority]}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-2">{task.description}</p>

                {task.dueDate && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>Due: {format(new Date(task.dueDate), 'yyyy-MM-dd')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
