var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
define(['jQuery', 'Underscore', 'Backbone', "text!templates/node.tmpl.html", "order!libs/jquery.tmpl.min", "order!libs/jquery.contextMenu", "order!libs/jquery-ui/js/jquery-ui-1.9m6.min", 'order!threenodes/core/NodeFieldRack', 'order!threenodes/utils/Utils'], function($, _, Backbone, _view_node_template) {
  ThreeNodes.nodes.types.Three.Object3D = (function() {
    __extends(Object3D, ThreeNodes.NodeBase);
    function Object3D() {
      this.compute = __bind(this.compute, this);
      this.set_fields = __bind(this.set_fields, this);
      Object3D.__super__.constructor.apply(this, arguments);
    }
    Object3D.prototype.set_fields = function() {
      Object3D.__super__.set_fields.apply(this, arguments);
      this.auto_evaluate = true;
      this.ob = new THREE.Object3D();
      this.rack.addFields({
        inputs: {
          "children": {
            type: "Array",
            val: []
          },
          "position": {
            type: "Vector3",
            val: new THREE.Vector3()
          },
          "rotation": {
            type: "Vector3",
            val: new THREE.Vector3()
          },
          "scale": {
            type: "Vector3",
            val: new THREE.Vector3(1, 1, 1)
          },
          "doubleSided": false,
          "visible": true,
          "castShadow": false,
          "receiveShadow": false
        },
        outputs: {
          "out": {
            type: "Any",
            val: this.ob
          }
        }
      });
      this.vars_shadow_options = ["castShadow", "receiveShadow"];
      return this.shadow_cache = this.create_cache_object(this.vars_shadow_options);
    };
    Object3D.prototype.compute = function() {
      var child, childs_in, ind, _i, _j, _len, _len2, _ref;
      this.apply_fields_to_val(this.rack.node_fields.inputs, this.ob, ['children']);
      childs_in = this.rack.get("children").get();
      if (this.rack.get("children").connections.length === 0 && this.ob.children.length !== 0) {
        while (this.ob.children.length > 0) {
          this.ob.remove(this.ob.children[0]);
        }
      }
      _ref = this.ob.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        ind = childs_in.indexOf(child);
        if (child && ind === -1 && child) {
          this.ob.removeChild(child);
        }
      }
      for (_j = 0, _len2 = childs_in.length; _j < _len2; _j++) {
        child = childs_in[_j];
        ind = this.ob.children.indexOf(child);
        if (ind === -1) {
          this.ob.addChild(child);
        }
      }
      return this.rack.set("out", this.ob);
    };
    return Object3D;
  })();
  ThreeNodes.nodes.types.Three.Scene = (function() {
    __extends(Scene, ThreeNodes.nodes.types.Three.Object3D);
    function Scene() {
      this.compute = __bind(this.compute, this);
      this.apply_children = __bind(this.apply_children, this);
      this.set_fields = __bind(this.set_fields, this);
      Scene.__super__.constructor.apply(this, arguments);
    }
    Scene.prototype.set_fields = function() {
      var current_scene;
      Scene.__super__.set_fields.apply(this, arguments);
      this.ob = new THREE.Scene();
      return current_scene = this.ob;
    };
    Scene.prototype.apply_children = function() {
      var child, childs_in, ind, _i, _j, _k, _len, _len2, _len3, _ref, _ref2, _results;
      if (this.rack.get("children").connections.length === 0 && this.ob.children.length !== 0) {
        while (this.ob.children.length > 0) {
          this.ob.remove(this.ob.children[0]);
        }
        return true;
      }
      childs_in = this.rack.get("children").get();
      _ref = this.ob.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        ind = childs_in.indexOf(child);
        if (child && ind === -1 && child instanceof THREE.Light === false) {
          this.ob.remove(child);
        }
      }
      _ref2 = this.ob.children;
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        child = _ref2[_j];
        ind = childs_in.indexOf(child);
        if (child && ind === -1 && child instanceof THREE.Light === true) {
          this.ob.remove(child);
        }
      }
      _results = [];
      for (_k = 0, _len3 = childs_in.length; _k < _len3; _k++) {
        child = childs_in[_k];
        _results.push(child instanceof THREE.Light === true ? (ind = this.ob.children.indexOf(child), ind === -1 ? (this.ob.add(child), ThreeNodes.rebuild_all_shaders()) : void 0) : (ind = this.ob.children.indexOf(child), ind === -1 ? this.ob.add(child) : void 0));
      }
      return _results;
    };
    Scene.prototype.compute = function() {
      this.apply_fields_to_val(this.rack.node_fields.inputs, this.ob, ['children', 'lights']);
      this.apply_children();
      return this.rack.set("out", this.ob);
    };
    return Scene;
  })();
  ThreeNodes.nodes.types.Three.Mesh = (function() {
    __extends(Mesh, ThreeNodes.nodes.types.Three.Object3D);
    function Mesh() {
      this.compute = __bind(this.compute, this);
      this.rebuild_geometry = __bind(this.rebuild_geometry, this);
      this.set_fields = __bind(this.set_fields, this);
      Mesh.__super__.constructor.apply(this, arguments);
    }
    Mesh.prototype.set_fields = function() {
      Mesh.__super__.set_fields.apply(this, arguments);
      this.rack.addFields({
        inputs: {
          "geometry": {
            type: "Any",
            val: new THREE.CubeGeometry(200, 200, 200)
          },
          "material": {
            type: "Any",
            val: new THREE.MeshBasicMaterial({
              color: 0xff0000
            })
          },
          "overdraw": false
        }
      });
      this.ob = new THREE.Mesh(this.rack.get('geometry').get(), this.rack.get('material').get());
      this.geometry_cache = false;
      this.material_cache = false;
      return this.compute();
    };
    Mesh.prototype.rebuild_geometry = function() {
      var field, geom;
      field = this.rack.get('geometry');
      if (field.connections.length > 0) {
        geom = field.connections[0].from_field.node;
        geom.cached = [];
        return geom.compute();
      } else {
        return this.rack.get('geometry').set(new THREE.CubeGeometry(200, 200, 200));
      }
    };
    Mesh.prototype.compute = function() {
      var needs_rebuild;
      needs_rebuild = false;
      if (this.input_value_has_changed(this.vars_shadow_options, this.shadow_cache)) {
        needs_rebuild = true;
      }
      if (this.material_cache !== this.rack.get('material').get().id) {
        this.rebuild_geometry();
      }
      if (this.geometry_cache !== this.rack.get('geometry').get().id || this.material_cache !== this.rack.get('material').get().id || needs_rebuild) {
        this.ob = new THREE.Mesh(this.rack.get('geometry').get(), this.rack.get('material').get());
        this.geometry_cache = this.rack.get('geometry').get().id;
        this.material_cache = this.rack.get('material').get().id;
      }
      this.apply_fields_to_val(this.rack.node_fields.inputs, this.ob, ['children', 'geometry', 'material']);
      this.shadow_cache = this.create_cache_object(this.vars_shadow_options);
      if (needs_rebuild === true) {
        ThreeNodes.rebuild_all_shaders();
      }
      return this.rack.set("out", this.ob);
    };
    return Mesh;
  })();
  ThreeNodes.nodes.types.Three.ParticleSystem = (function() {
    __extends(ParticleSystem, ThreeNodes.nodes.types.Three.Object3D);
    function ParticleSystem() {
      this.compute = __bind(this.compute, this);
      this.rebuild_geometry = __bind(this.rebuild_geometry, this);
      this.set_fields = __bind(this.set_fields, this);
      ParticleSystem.__super__.constructor.apply(this, arguments);
    }
    ParticleSystem.prototype.set_fields = function() {
      ParticleSystem.__super__.set_fields.apply(this, arguments);
      this.rack.addFields({
        inputs: {
          "geometry": {
            type: "Any",
            val: new THREE.CubeGeometry(200, 200, 200)
          },
          "material": {
            type: "Any",
            val: new THREE.ParticleBasicMaterial()
          }
        }
      });
      this.ob = new THREE.ParticleSystem(this.rack.get('geometry').get(), this.rack.get('material').get());
      this.geometry_cache = false;
      this.material_cache = false;
      return this.compute();
    };
    ParticleSystem.prototype.rebuild_geometry = function() {
      var field, geom;
      field = this.rack.get('geometry');
      if (field.connections.length > 0) {
        geom = field.connections[0].from_field.node;
        geom.cached = [];
        return geom.compute();
      } else {
        return this.rack.get('geometry').set(new THREE.CubeGeometry(200, 200, 200));
      }
    };
    ParticleSystem.prototype.compute = function() {
      var needs_rebuild;
      needs_rebuild = false;
      if (this.material_cache !== this.rack.get('material').get().id) {
        this.rebuild_geometry();
      }
      if (this.geometry_cache !== this.rack.get('geometry').get().id || this.material_cache !== this.rack.get('material').get().id || needs_rebuild) {
        this.ob = new THREE.ParticleSystem(this.rack.get('geometry').get(), this.rack.get('material').get());
        this.geometry_cache = this.rack.get('geometry').get().id;
        this.material_cache = this.rack.get('material').get().id;
      }
      this.apply_fields_to_val(this.rack.node_fields.inputs, this.ob, ['children', 'geometry', 'material']);
      if (needs_rebuild === true) {
        ThreeNodes.rebuild_all_shaders();
      }
      return this.rack.set("out", this.ob);
    };
    return ParticleSystem;
  })();
  ThreeNodes.nodes.types.Three.Camera = (function() {
    __extends(Camera, ThreeNodes.NodeBase);
    function Camera() {
      this.compute = __bind(this.compute, this);
      this.set_fields = __bind(this.set_fields, this);
      Camera.__super__.constructor.apply(this, arguments);
    }
    Camera.prototype.set_fields = function() {
      Camera.__super__.set_fields.apply(this, arguments);
      this.ob = new THREE.PerspectiveCamera(75, 800 / 600, 1, 10000);
      return this.rack.addFields({
        inputs: {
          "fov": 50,
          "aspect": 1,
          "near": 0.1,
          "far": 2000,
          "position": {
            type: "Vector3",
            val: new THREE.Vector3()
          },
          "target": {
            type: "Vector3",
            val: new THREE.Vector3()
          },
          "useTarget": false
        },
        outputs: {
          "out": {
            type: "Any",
            val: this.ob
          }
        }
      });
    };
    Camera.prototype.compute = function() {
      this.apply_fields_to_val(this.rack.node_fields.inputs, this.ob, ['target']);
      this.ob.lookAt(this.rack.get("target").get());
      return this.rack.set("out", this.ob);
    };
    return Camera;
  })();
  ThreeNodes.nodes.types.Three.Texture = (function() {
    __extends(Texture, ThreeNodes.NodeBase);
    function Texture() {
      this.compute = __bind(this.compute, this);
      this.set_fields = __bind(this.set_fields, this);
      Texture.__super__.constructor.apply(this, arguments);
    }
    Texture.prototype.set_fields = function() {
      Texture.__super__.set_fields.apply(this, arguments);
      this.ob = false;
      this.cached = false;
      return this.rack.addFields({
        inputs: {
          "image": {
            type: "String",
            val: false
          }
        },
        outputs: {
          "out": {
            type: "Any",
            val: this.ob
          }
        }
      });
    };
    Texture.prototype.compute = function() {
      var current;
      current = this.rack.get("image").get();
      if (current && current !== "") {
        if (this.cached === false ||  ($.type(this.cached) === "object" && this.cached.constructor === THREE.Texture && this.cached.image.attributes[0].nodeValue !== current)) {
          this.ob = new THREE.ImageUtils.loadTexture(current);
          console.log("new texture");
          console.log(this.ob);
          this.cached = this.ob;
        }
      }
      return this.rack.set("out", this.ob);
    };
    return Texture;
  })();
  return ThreeNodes.nodes.types.Three.WebGLRenderer = (function() {
    __extends(WebGLRenderer, ThreeNodes.NodeBase);
    function WebGLRenderer() {
      this.compute = __bind(this.compute, this);
      this.add_renderer_to_dom = __bind(this.add_renderer_to_dom, this);
      this.apply_post_fx = __bind(this.apply_post_fx, this);
      this.apply_size = __bind(this.apply_size, this);
      this.set_fields = __bind(this.set_fields, this);
      WebGLRenderer.__super__.constructor.apply(this, arguments);
    }
    WebGLRenderer.prototype.set_fields = function() {
      var self;
      WebGLRenderer.__super__.set_fields.apply(this, arguments);
      this.auto_evaluate = true;
      this.preview_mode = true;
      this.creating_popup = false;
      this.ob = ThreeNodes.Webgl.current_renderer;
      this.width = 0;
      this.height = 0;
      $("body").append("<div id='webgl-window'></div>");
      this.webgl_container = $("#webgl-window");
      this.rack.addFields({
        inputs: {
          "width": 800,
          "height": 600,
          "scene": {
            type: "Scene",
            val: new THREE.Scene()
          },
          "camera": {
            type: "Camera",
            val: new THREE.PerspectiveCamera(75, 800 / 600, 1, 10000)
          },
          "bg_color": {
            type: "Color",
            val: new THREE.Color(0, 0, 0)
          },
          "postfx": {
            type: "Array",
            val: []
          },
          "shadowCameraNear": 3,
          "shadowCameraFar": 3000,
          "shadowMapWidth": 512,
          "shadowMapHeight": 512,
          "shadowMapEnabled": false,
          "shadowMapSoft": true
        }
      });
      this.rack.get("camera").val.position.z = 1000;
      this.win = false;
      this.apply_size();
      this.old_bg = false;
      this.apply_bg_color();
      self = this;
      return this.webgl_container.click(function(e) {
        return self.create_popup_view();
      });
    };
    WebGLRenderer.prototype.create_popup_view = function() {
      this.preview_mode = false;
      this.creating_popup = true;
      this.win = window.open('', 'win' + this.nid, "width=800,height=600,scrollbars=false,location=false,status=false,menubar=false");
      $("body", $(this.win.document)).append(this.ob.domElement);
      $("*", $(this.win.document)).css({
        padding: 0,
        margin: 0
      });
      this.apply_bg_color(true);
      return this.apply_size(true);
    };
    WebGLRenderer.prototype.create_preview_view = function() {
      this.preview_mode = true;
      this.webgl_container.append(this.ob.domElement);
      this.apply_bg_color(true);
      return this.apply_size(true);
    };
    WebGLRenderer.prototype.apply_bg_color = function(force_refresh) {
      var new_val;
      if (force_refresh == null) {
        force_refresh = false;
      }
      new_val = this.rack.get('bg_color').get().getContextStyle();
      if (this.old_bg === new_val && force_refresh === false) {
        return false;
      }
      this.ob.setClearColor(this.rack.get('bg_color').get(), 1);
      this.webgl_container.css({
        background: new_val
      });
      if (this.win) {
        $(this.win.document.body).css({
          background: new_val
        });
      }
      return this.old_bg = new_val;
    };
    WebGLRenderer.prototype.apply_size = function(force_refresh) {
      var dh, dw, h, maxw, r, w;
      if (force_refresh == null) {
        force_refresh = false;
      }
      w = this.rack.get('width').get();
      h = this.rack.get('height').get();
      dw = w;
      dh = h;
      if (this.win === false) {
        maxw = 220;
        r = w / h;
        dw = maxw;
        dh = dw / r;
      }
      if (dw !== this.width || dh !== this.height ||  force_refresh) {
        this.ob.setSize(dw, dh);
      }
      this.width = dw;
      return this.height = dh;
    };
    WebGLRenderer.prototype.apply_post_fx = function() {
      var fxs;
      fxs = this.rack.get("postfx").get().slice(0);
      fxs.unshift(ThreeNodes.Webgl.renderModel);
      fxs.push(ThreeNodes.Webgl.effectScreen);
      return ThreeNodes.Webgl.composer.passes = fxs;
    };
    WebGLRenderer.prototype.add_renderer_to_dom = function() {
      if (this.preview_mode && $("canvas", this.webgl_container).length === 0) {
        this.create_preview_view();
      }
      if (this.preview_mode === false && this.win === false) {
        return this.create_popup_view();
      }
    };
    WebGLRenderer.prototype.compute = function() {
      if (this.creating_popup === true && !this.win) {
        return;
      }
      this.creating_popup = false;
      if (this.win !== false) {
        if (this.win.closed && this.preview_mode === false) {
          this.preview_mode = true;
          this.win = false;
        }
      }
      if (!this.context.testing_mode) {
        this.add_renderer_to_dom();
      }
      this.apply_size();
      this.apply_bg_color();
      this.apply_fields_to_val(this.rack.node_fields.inputs, this.ob, ['width', 'height', 'scene', 'camera', 'bg_color', 'postfx']);
      ThreeNodes.Webgl.current_camera = this.rack.get("camera").get();
      ThreeNodes.Webgl.current_scene = this.rack.get("scene").get();
      this.apply_post_fx();
      this.ob.clear();
      ThreeNodes.Webgl.renderModel.scene = ThreeNodes.Webgl.current_scene;
      ThreeNodes.Webgl.renderModel.camera = ThreeNodes.Webgl.current_camera;
      ThreeNodes.Webgl.composer.renderer = ThreeNodes.Webgl.current_renderer;
      return ThreeNodes.Webgl.composer.render(0.05);
    };
    return WebGLRenderer;
  })();
});