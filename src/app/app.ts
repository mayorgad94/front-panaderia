import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Producto {
  id: number;
  nombre: string;
  precio: string;
  descripcion: string;
}

interface PedidoProducto {
  producto_id: number;
  cantidad: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  productos: Producto[] = [];
  cargando = true;
  carrito: PedidoProducto[] = [];
  cliente = '';
  mensaje = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<Producto[]>('https://api-panaderia-648693421230.europe-west4.run.app/productos').subscribe({
      next: (data) => {
        this.productos = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar productos', err);
        this.cargando = false;
        this.setMensaje('Error al cargar los productos.');
      }
    });
  }

  agregarProducto(producto: Producto) {
    const existente = this.carrito.find(p => p.producto_id === producto.id);
    if (existente) {
      existente.cantidad++;
    } else {
      this.carrito.push({ producto_id: producto.id, cantidad: 1 });
    }
  }

  quitarProducto(producto: PedidoProducto) {
    const index = this.carrito.findIndex(p => p.producto_id === producto.producto_id);
    if (index >= 0) {
      if (this.carrito[index].cantidad > 1) {
        this.carrito[index].cantidad--;
      } else {
        this.carrito.splice(index, 1);
      }
    }
  }

  incrementarCantidad(producto_id: number) {
    const producto = this.productos.find(p => p.id === producto_id);
    if (producto) {
      this.agregarProducto(producto);
    }
  }

  generarPedido() {
    if (!this.cliente || this.carrito.length === 0) {
      this.setMensaje('Debe ingresar su nombre y agregar productos.');
      return;
    }

    const pedido = {
      cliente: this.cliente,
      productos: this.carrito
    };

    this.http.post('https://api-panaderia-648693421230.europe-west4.run.app/pedido', pedido).subscribe({
      next: () => {
        this.carrito = [];   // Limpiar carrito
        this.cliente = '';   // Limpiar nombre
        this.setMensaje('¡Pedido generado con éxito!');
      },
      error: (err) => {
        console.error('Error al generar pedido', err);
        this.setMensaje('Error al generar el pedido.');
      }
    });
  }

  obtenerNombreProducto(id: number): string {
    const producto = this.productos.find(p => p.id === id);
    return producto ? producto.nombre : 'Producto';
  }

  calcularTotal(): number {
    return this.carrito.reduce((total, item) => {
      const producto = this.productos.find(p => p.id === item.producto_id);
      return total + (producto ? parseFloat(producto.precio) * item.cantidad : 0);
    }, 0);
  }

  private setMensaje(texto: string) {
    this.mensaje = texto;
  }

  cerrarModal() {
    this.mensaje = '';
  }
}
