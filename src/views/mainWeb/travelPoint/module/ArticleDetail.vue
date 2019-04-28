<template>
  <div>
     <el-form ref="from" :model="form" class="form-container">
        <!-- 提交按钮部分 -->
        <div style="width：100%;height:60px;background:#cdcdcd;">
            <el-button style="float:right;margin-right:20px;margin-top:10px" type="success" @click="doSubmit" :loading="loading">
            完成景点
            </el-button>
        </div>
        <div style="width:95%;margin:20px auto 0;">
            <el-form-item label="景点名称">
                <el-input  style="width: 370px;" v-model="form.name"/>
            </el-form-item>
            <el-form-item label="英文名称">
                <el-input  style="width: 370px;" v-model="form.enName"/>
            </el-form-item>
            <el-form-item label="主页图片">
                <el-upload
                  :before-remove="handleindeximgurlRemove"
                  :headers="headers"
                  :limit="1"
                  :action="imagesUploadApi"
                  :file-list="indeximages"
                  :on-success="doindeximgSubmit"
                  list-type="picture-card">
                  <i class="el-icon-plus"/>
                </el-upload>
            </el-form-item>
            <el-form-item label="轮播图片">
                <el-upload
                  :before-remove="handleimgurlRemove"
                  :headers="headers"
                  :limit="6"
                  :action="imagesUploadApi"
                  :file-list="flashimages"
                  :data="uploadCangKuParams"
                  :on-success="doflashimgSubmit"
                  list-type="picture-card">
                  <i class="el-icon-plus"/>
                </el-upload>
            </el-form-item>
            <el-form-item label="景点介绍">
                <el-input type="textarea" :rows="6" style="width: 70%;" v-model="form.description"/>
            </el-form-item>
            <el-form-item label="交通指南">
                <el-input type="textarea" :rows="6" style="width: 70%;" v-model="form.transportation"/>
            </el-form-item>
        </div>
    </el-form>
  </div>
</template>

<script>
import MDinput from '@/components/MDinput'
import { validURL } from '@/utils/validate'
import { mapGetters } from 'vuex'
import { add, edit } from '@/api/travelPoint'
import { fetchArticle } from '@/api/article'
import { getToken } from '@/utils/auth'
//import Warning from './Warning'
//import { CommentDropdown, PlatformDropdown, SourceUrlDropdown } from './Dropdown'
const defaultForm = {
    name: '',
    enName:'',
    imgUrl: '',
    images:[],
    description: '',
    transportation: ''
}
export default {
  name: 'WorkDetail',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
      return {
        headers: {
          'Authorization': 'Bearer ' + getToken()
        },
        detailId:[],
        loading: false,
        form: Object.assign({}, defaultForm),
        indeximages:[
        ],
        flashimages:[],
        indexpictures: [],
        falshpictures:[],
        uploadCangKuParams: {bizType:'WARE_HOUSE_IMAGE'},
      }
  },
  computed: {
    /*富文本上传图片*/
    ...mapGetters([
      'imagesUploadApi'
    ])
  },
  created() {
    this.detailId = this.$route.query.id;
    /*判断是编辑还是新增文章*/
    if (this.isEdit) {
      const id = this.detailId
      this.fetchData(id)
      console.log(id)
    } else {
      this.form = Object.assign({}, defaultForm)
    }
  },
  methods: {
      fetchData(id) {
        /*点击编辑，通过id获得后台的值*/
        // editdetail(id).then(res => {
        //   //根据id获得的值传给前台
        //   console.log(res)
        // }).catch(err => {
          
        // })
      },
      /*点击完成文章*/
      doSubmit() {
        console.log(this.form.images)
          // 判断内容有没有输入完整
          if(this.form.name===""||this.form.imgUrl===""||this.form.images.length==0||this.form.description===""||this.form.transportation===""||this.form.enName===""){
              this.$message({
                message: '内容没有输入完整',
                type: 'warning'
              });
            return
          } 
          //console.log(this.form)
          this.loading = true
          this.doAdd()
      },
      /*增加文章执行的操作*/
      doAdd() {
        add(this.form).then(res => {
          this.resetForm()
          this.$notify({
            title: '添加成功',
            type: 'success',
            duration: 2500
          })
          this.loading = false
          this.$parent.$parent.init()
        }).catch(err => {
          this.loading = false
          console.log(err.response.data.message)
        })
      },
      //删除主页图片
      handleindeximgurlRemove(file, fileList) {
        for (let i = 0; i < this.indexpictures.length; i++) {
          if (this.indexpictures[i].uid === file.uid) {
            del(this.indexpictures[i].id).then(res => {})
            return true
          }
        }
        //删除的时候清空form里面imgurl的值
        this.form.imgUrl=""
      },
      //删除轮播图片
      handleimgurlRemove(file, fileList) {
        for (let i = 0; i < this.falshpictures.length; i++) {
          if (this.falshpictures[i].uid === file.uid) {
            del(this.falshpictures[i].id).then(res => {})
            return true
          }
        }
         var b=file.response.id
         console.log(b)
        //  var thisb=b.join()
        //  for (let y = 0; y <this.form.images.length; y++) {
        //       if(this.form.images[y].id===thisb){
        //         console.log(y)
        //         this.form.images.splice(y,1);
        //       }

        //  }
        //删除的时候清空form里面imgurl的值
        console.log(this.form.images.length)
      },
      //获得主图的链接
      doindeximgSubmit(file, fileList){
        var a=file.data
        var thisa=a.join()
        this.form.imgUrl=thisa
      },
       //获得轮播图的链接
      doflashimgSubmit(file, fileList){
        var a=file.id
        this.form.images.push({ id:a })
        console.log(this.form.images)
      },
      //清空表单
      resetForm() {
        this.indeximages=[]
        this.flashimages=[]
        this.form = {
          name: '',
          imgUrl: '',
          images:'',
          description: '',
          transportation: ''
        }
      },
     
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea /deep/ {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
