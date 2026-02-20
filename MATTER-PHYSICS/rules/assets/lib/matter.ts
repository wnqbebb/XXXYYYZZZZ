/**
 * Matter.js Module Exports & Types
 * Centralized exports for all Matter.js modules
 */

import Matter from 'matter-js'

// Core modules
export const {
  Engine,
  Render,
  Runner,
  Bodies,
  Body,
  Composite,
  Composites,
  Constraint,
  Mouse,
  MouseConstraint,
  Events,
  Query,
  Vector,
  Vertices,
  Sleeping,
  Common
} = Matter

// Default export
export default Matter

// Re-export types
export type Engine = Matter.Engine
export type Render = Matter.Render
export type Runner = Matter.Runner
export type Body = Matter.Body
export type Composite = Matter.Composite
export type Constraint = Matter.Constraint
export type Mouse = Matter.Mouse
export type MouseConstraint = Matter.MouseConstraint
export type Vector = Matter.Vector
export type Vertices = Matter.Vertices

// Custom body options interface
export interface PhysicsBodyOptions extends Matter.IBodyDefinition {
  plugin?: {
    [key: string]: any
  }
}

// Collision categories
export const CollisionCategories = {
  DEFAULT: 0x0001,
  PLAYER: 0x0002,
  ENEMY: 0x0004,
  ITEM: 0x0008,
  BULLET: 0x0010,
  WALL: 0x0020,
  SENSOR: 0x0040
} as const

// Physics presets
export const PhysicsPresets = {
  // Materials
  materials: {
    bouncy: {
      restitution: 0.9,
      friction: 0.1,
      frictionAir: 0.01
    },
    heavy: {
      density: 0.1,
      friction: 0.5,
      restitution: 0.1
    },
    slippery: {
      friction: 0,
      frictionStatic: 0,
      restitution: 0.2
    },
    static: {
      isStatic: true,
      friction: 0.5,
      restitution: 0.2
    }
  },
  
  // Constraints
  springs: {
    loose: { stiffness: 0.1, damping: 0.01 },
    normal: { stiffness: 0.5, damping: 0.01 },
    tight: { stiffness: 0.9, damping: 0.1 },
    rigid: { stiffness: 1, damping: 0.5 }
  }
} as const
