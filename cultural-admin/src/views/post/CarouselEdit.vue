<template>
  <div>
    <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      :showCancel="true"
      @close="dialogConfig.show = false"
      width="60%"
    >
      <el-form
        :model="formData"
        :rules="rules"
        ref="formDataRef"
        label-width="80px"
        @submit.prevent
      >
        <el-form-item label="类型" prop="objectType">
          <el-radio-group v-model="formData.objectType">
            <!-- 这里不能用循环绑定，组件缺陷
            <el-radio v-for="(item, index) in OBJECT_TYPE_MAP" :label="index">{{
              item
            }}</el-radio> -->
            <el-radio :label="0">移动端轮播图</el-radio>
            <el-radio :label="1">PC轮播图</el-radio>
            <el-radio :label="2">专题</el-radio>
            <el-radio :label="3">外部链接</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="轮播图" prop="appImgUrl">
          <NewCoverUpload
            v-model="formData.appImgUrl"
            :width="330"
            :height="180"
            :type="1"
          ></NewCoverUpload>
        </el-form-item>
        <!--地址或id-->
        <el-form-item
          label="链接地址"
          prop="outerLink"
          v-if="formData.objectType == 3"
        >
          <el-input
            clearable
            placeholder="请输入完整url地址"
            maxLength="100"
            v-model="formData.outerLink"
          ></el-input>
        </el-form-item>
        <el-form-item label="文章id" prop="objectId" v-else>
          <el-input
            clearable
            placeholder="请输入准确的文章ID"
            maxLength="10"
            v-model="formData.objectId"
          ></el-input>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import { OBJECT_TYPE_MAP } from "@/utils/Constants";
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance();

const api = {
  saveCarousel: "/carousel/saveCarousel",
};

const dialogConfig = ref({
  show: false,
  title: "新增轮播图",
  buttons: [
    {
      type: "primary",
      text: "确定",
      click: (e) => {
        submitForm();
      },
    },
  ],
});

const formData = ref({});
const formDataRef = ref();
const rules = {
  objectType: [{ required: true, message: "请选择类型" }],
  objectId: [{ required: true, message: "请选择内容id" }],
  outerLink: [{ required: true, message: "请输入url地址" }],
};

const showEdit = (data) => {
  dialogConfig.value.show = true;
  nextTick(() => {
    formDataRef.value.resetFields();
    if (data.carouselId == null) {
      dialogConfig.value.title = "新增轮播图";
      formData.value = {};
    } else {
      dialogConfig.value.title = "修改轮播图";
      formData.value = Object.assign({}, data);
      console.log(typeof formData.value.objectType);
    }
  });
};

defineExpose({
  showEdit,
});

const emit = defineEmits(["reload"]);
const submitForm = async () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    let params = {};
    Object.assign(params, formData.value);
    console.log(params);
    let result = await proxy.Request({
      url: api.saveCarousel,
      params,
    });
    if (!result) {
      return;
    }
    dialogConfig.value.show = false;
    proxy.Message.success("保存成功!");
    emit("reload");
  });
};
</script>

<style lang="scss" scoped>
.check-span-item {
  float: left;
  margin-right: 10px;
  line-height: 20px;
}
</style>
