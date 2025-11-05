// @ts-nocheck
import { Scene } from 'three';
import * as Three from 'three';

function addEdge(
  object: Three.Group,
  material: Three.Material,
  xMul: number, yMul: number, zMul: number
) {
  const points = [
    new Three.Vector3(32 * xMul, 32 * yMul, zMul),
    new Three.Vector3(8 * xMul, 32 * yMul, zMul),
    new Three.Vector3(8 * xMul, 24 * yMul, zMul),
    new Three.Vector3(24 * xMul, 24 * yMul, zMul),
    new Three.Vector3(24 * xMul, 8 * yMul, zMul),
    new Three.Vector3(32 * xMul, 8 * yMul, zMul),
    new Three.Vector3(32 * xMul, 32 * yMul, zMul),
  ];

  object.add(new Three.Line(new Three.BufferGeometry().setFromPoints(points), material));
}

function addEdgeInterConnection(
  object: Three.Group,
  material: Three.Material,
  xMul: number, yMul: number, zMin: number, zMax: number
) {
  object.add(new Three.Line(new Three.BufferGeometry().setFromPoints([
    new Three.Vector3(32 * xMul, 32 * yMul, zMin),
    new Three.Vector3(32 * xMul, 32 * yMul, zMax),
  ]), material));

  object.add(new Three.Line(new Three.BufferGeometry().setFromPoints([
    new Three.Vector3(8 * xMul, 32 * yMul, zMin),
    new Three.Vector3(8 * xMul, 32 * yMul, zMax),
  ]), material));

  object.add(new Three.Line(new Three.BufferGeometry().setFromPoints([
    new Three.Vector3(8 * xMul, 24 * yMul, zMin),
    new Three.Vector3(8 * xMul, 24 * yMul, zMax),
  ]), material));

  object.add(new Three.Line(new Three.BufferGeometry().setFromPoints([
    new Three.Vector3(24 * xMul, 24 * yMul, zMin),
    new Three.Vector3(24 * xMul, 24 * yMul, zMax),
  ]), material));

  object.add(new Three.Line(new Three.BufferGeometry().setFromPoints([
    new Three.Vector3(24 * xMul, 8 * yMul, zMin),
    new Three.Vector3(24 * xMul, 8 * yMul, zMax),
  ]), material));

  object.add(new Three.Line(new Three.BufferGeometry().setFromPoints([
    new Three.Vector3(32 * xMul, 8 * yMul, zMin),
    new Three.Vector3(32 * xMul, 8 * yMul, zMax),
  ]), material));

  object.add(new Three.Line(new Three.BufferGeometry().setFromPoints([
    new Three.Vector3(32 * xMul, 32 * yMul, zMin),
    new Three.Vector3(32 * xMul, 32 * yMul, zMax),
  ]), material));
}

function addMiddle(
  object: Three.Group,
  material: Three.Material,
  xMul: number, yMul: number, zMul: number
) {
  const points = [
    new Three.Vector3(16 * xMul, 16 * yMul, zMul),
    new Three.Vector3(8 * xMul, 16 * yMul, zMul),
    new Three.Vector3(8 * xMul, 8 * yMul, zMul),
    new Three.Vector3(16 * xMul, 8 * yMul, zMul),
    new Three.Vector3(16 * xMul, 16 * yMul, zMul),
  ];

  object.add(new Three.Line(new Three.BufferGeometry().setFromPoints(points), material));
}

function addMiddleConnection(
  object: Three.Group,
  material: Three.Material,
  xMul: number, yMul: number, zMin: number, zMax: number
) {
  object.add(new Three.Line(new Three.BufferGeometry().setFromPoints([
    new Three.Vector3(16 * xMul, 16 * yMul, zMin),
    new Three.Vector3(16 * xMul, 16 * yMul, zMax),
  ]), material));

  object.add(new Three.Line(new Three.BufferGeometry().setFromPoints([
    new Three.Vector3(8 * xMul, 16 * yMul, zMin),
    new Three.Vector3(8 * xMul, 16 * yMul, zMax),
  ]), material));

  object.add(new Three.Line(new Three.BufferGeometry().setFromPoints([
    new Three.Vector3(8 * xMul, 8 * yMul, zMin),
    new Three.Vector3(8 * xMul, 8 * yMul, zMax),
  ]), material));

  object.add(new Three.Line(new Three.BufferGeometry().setFromPoints([
    new Three.Vector3(16 * xMul, 8 * yMul, zMin),
    new Three.Vector3(16 * xMul, 8 * yMul, zMax),
  ]), material));
}

function addCenter(
  object: Three.Group,
  material: Three.Material,
  xMul: number, yMul: number, zMul: number
) {
  const points = [
    new Three.Vector3(-6 * xMul, -6 * yMul, zMul),
    new Three.Vector3(6 * xMul, -6 * yMul, zMul),
    new Three.Vector3(6 * xMul, 6 * yMul, zMul),
    new Three.Vector3(-6 * xMul, 6 * yMul, zMul),
    new Three.Vector3(-6 * xMul, -6 * yMul, zMul),
  ];

  object.add(new Three.Line(new Three.BufferGeometry().setFromPoints(points), material));
}

function addCenterConnection(
  object: Three.Group,
  material: Three.Material,
  xMul: number, yMul: number, zMin: number, zMax: number
) {
  object.add(new Three.Line(new Three.BufferGeometry().setFromPoints([
    new Three.Vector3(-6 * xMul, -6 * yMul, zMin),
    new Three.Vector3(-6 * xMul, -6 * yMul, zMax),
  ]), material));

  object.add(new Three.Line(new Three.BufferGeometry().setFromPoints([
    new Three.Vector3(-6 * xMul, 6 * yMul, zMin),
    new Three.Vector3(-6 * xMul, 6 * yMul, zMax),
  ]), material));

  object.add(new Three.Line(new Three.BufferGeometry().setFromPoints([
    new Three.Vector3(6 * xMul, 6 * yMul, zMin),
    new Three.Vector3(6 * xMul, 6 * yMul, zMax),
  ]), material));

  object.add(new Three.Line(new Three.BufferGeometry().setFromPoints([
    new Three.Vector3(6 * xMul, -6 * yMul, zMin),
    new Three.Vector3(6 * xMul, -6 * yMul, zMax),
  ]), material));
}

export function XosLogo(material: Three.LineBasicMaterial): Three.Group {
  let group = new Three.Group();

  addEdge(group, material, -1, -1, 1);
  addEdge(group, material, -1, 1, 1);
  addEdge(group, material, 1, 1, 1);
  addEdge(group, material, 1, -1, 1);

  addEdge(group, material, -1, -1, -1);
  addEdge(group, material, -1, 1, -1);
  addEdge(group, material, 1, 1, -1);
  addEdge(group, material, 1, -1, -1);

  addEdgeInterConnection(group, material, -1, -1, -1, 1);
  addEdgeInterConnection(group, material, -1, 1, -1, 1);
  addEdgeInterConnection(group, material, 1, 1, -1, 1);
  addEdgeInterConnection(group, material, 1, -1, -1, 1);

  addMiddle(group, material, -1, -1, 1);
  addMiddle(group, material, -1, 1, 1);
  addMiddle(group, material, 1, 1, 1);
  addMiddle(group, material, 1, -1, 1);

  addMiddle(group, material, -1, -1, -1);
  addMiddle(group, material, -1, 1, -1);
  addMiddle(group, material, 1, 1, -1);
  addMiddle(group, material, 1, -1, -1);

  addMiddleConnection(group, material, -1, -1, -1, 1);
  addMiddleConnection(group, material, -1, 1, -1, 1);
  addMiddleConnection(group, material, 1, 1, -1, 1);
  addMiddleConnection(group, material, 1, -1, -1, 1);

  addCenter(group, material, 1, 1, 1);
  addCenter(group, material, 1, 1, -1);

  addCenterConnection(group, material, 1, 1, -1, 1);

  group.name = 'xos_logo';

  return group;
}

